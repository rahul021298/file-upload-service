import { IsOptional, IsString } from 'class-validator';

export class UploadMetadataDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
