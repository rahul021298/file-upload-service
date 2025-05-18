import { Injectable } from '@nestjs/common';

@Injectable()
export class FileProcessingService {
  async extractData(): Promise<string> {
    return `Mock hash: ${Math.random().toString(36).substring(2)}`;
  }
}
