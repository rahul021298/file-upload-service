import { User } from 'src/users/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

@Entity('files')
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'original_filename', length: 255 })
  originalFilename: string;

  @Column({ name: 'storage_path', type: 'text' })
  storagePath: string;

  @Column({ length: 255, nullable: true })
  title?: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({
    type: 'varchar',
    length: 50,
    default: 'uploaded',
  })
  status: 'uploaded' | 'processing' | 'processed' | 'failed';

  @Column({ name: 'extracted_data', type: 'text', nullable: true })
  extractedData?: string | null;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @CreateDateColumn({ name: 'uploaded_at' })
  uploadedAt: Date;
}
