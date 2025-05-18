import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { FileService } from 'src/file/file.service';
import { FileProcessingService } from './file-processing.service';

@Processor('file-processing')
export class FileProcessingProcessor extends WorkerHost {
  constructor(
    private readonly fileService: FileService,
    private readonly fileProcessingService: FileProcessingService,
  ) {
    super();
  }

  async process(job: Job<{ fileId: number }>): Promise<void> {
    const file = await this.fileService.getFileById(job.data.fileId);

    if (!file) throw new Error('File not found');

    const fileId = job.data.fileId;
    try {
      console.log(`Updating ${fileId} to processing`);
      await this.fileService.updateStatus(fileId, 'processing');
      await new Promise((resolve) => setTimeout(resolve, 1 * 60 * 1000));
      const extractedData = await this.fileProcessingService.extractData();
      console.log(`Updating ${fileId} to processed`);
      await this.fileService.updateStatusAndData(
        fileId,
        'processed',
        extractedData,
      );
    } catch (error) {
      console.log(`Updating ${fileId} to failed`);
      await this.fileService.updateStatusAndData(
        fileId,
        'failed',
        error.message,
      );
    }
  }
}
