import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FileSystemService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly fileSystemService: FileSystemService) {}

  @Get(':path')
  async listFilesAndDirectories(
    @Param('path') path: string,
  ): Promise<string[]> {
    return this.fileSystemService.listFilesAndDirectories(path);
  }
  @Get('content/:path/:filename')
  getFileContent(
    @Param('path') path: string,
    @Param('filename') fileName: string,
  ): Promise<string> {
    return this.fileSystemService.getFileContent(path, fileName);
  }

  @Post('createpath')
  createPath(@Body('path') path: string): string {
    return this.fileSystemService.createNewDirectory(path);
  }
}
