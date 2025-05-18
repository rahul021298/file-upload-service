import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from './entities/file.entity';
import { UploadMetadataDto } from './dto/file.dto';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>,
    @InjectQueue('file-processing')
    private fileQueue: Queue,
  ) {}

  async saveFileMetadata(
    file: Express.Multer.File,
    metadata: UploadMetadataDto,
    userId: number,
  ) {
    const fileMetadata = this.fileRepository.create({
      originalFilename: file.originalname,
      storagePath: file.path,
      title: metadata.title || '',
      description: metadata.description || '',
      extractedData: '',
      user: { id: userId },
      status: 'uploaded',
    });

    const savedFile = await this.fileRepository.save(fileMetadata);
    console.log(`Updated ${savedFile.id} to uploaded`);
    await this.fileQueue.add('process', {
      fileId: savedFile.id,
      path: file.path,
    });

    return savedFile;
  }

  async getFileByIdAndUser(fileId: number, userId: number) {
    const file = await this.fileRepository.findOne({
      where: { id: fileId, user: { id: userId } },
      select: ['id', 'title', 'description', 'status', 'extractedData'],
    });

    if (!file) {
      throw new NotFoundException('File not found or access denied');
    }

    return file;
  }

  async getFileById(fileId: number) {
    const file = await this.fileRepository.findOneBy({ id: fileId });

    if (!file) {
      throw new NotFoundException('File not found or access denied');
    }

    return file;
  }
  async updateStatus(
    fileId: number,
    status: 'processing' | 'processed' | 'failed',
  ): Promise<void> {
    const file = await this.fileRepository.findOne({ where: { id: fileId } });

    if (!file) {
      throw new NotFoundException(`File with id ${fileId} not found`);
    }

    file.status = status;
    await this.fileRepository.save(file);
  }

  async updateStatusAndData(
    fileId: number,
    status: 'processed' | 'failed',
    extractedData: string,
  ): Promise<void> {
    const file = await this.fileRepository.findOne({ where: { id: fileId } });

    if (!file) {
      throw new NotFoundException(`File with id ${fileId} not found`);
    }

    file.status = status;
    file.extractedData = extractedData;
    await this.fileRepository.save(file);
  }
}
