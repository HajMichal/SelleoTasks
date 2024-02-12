import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FileSystemService } from './files.service';

@Module({
  controllers: [FilesController],
  providers: [FileSystemService],
})
export class FileModule {}
