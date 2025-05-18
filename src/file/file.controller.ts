import {
  Controller,
  Post,
  Get,
  UploadedFile,
  UseInterceptors,
  Body,
  UseGuards,
  Request,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FileService } from './file.service';
import { extname } from 'path';
import { UploadMetadataDto } from './dto/file.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ThrottlerUserGuard } from 'src/common/guards/throttler-user.guard';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard, ThrottlerUserGuard)
  @Throttle({ default: { limit: 3, ttl: 10000 } })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() metadata: UploadMetadataDto,
    @Request() req,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const user = req.user;
    const uploadedFile = await this.fileService.saveFileMetadata(
      file,
      metadata,
      user.id,
    );

    return {
      id: uploadedFile.id,
      status: uploadedFile.status,
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getFileStatus(@Param('id') id: number, @Request() req) {
    const userId = req.user.id;
    return this.fileService.getFileByIdAndUser(id, userId);
  }
}
