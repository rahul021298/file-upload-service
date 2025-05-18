import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { FileProcessingProcessor } from './file-processing.processor';
import { FileProcessingService } from './file-processing.service';
import { FileModule } from '../file/file.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'file-processing',
    }),
    FileModule,
  ],
  providers: [FileProcessingProcessor, FileProcessingService],
  exports: [FileProcessingService],
})
export class FileProcessingModule {}
