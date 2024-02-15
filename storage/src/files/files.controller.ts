import {
  Body,
  Headers,
  Controller,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Res,
  Delete,
} from '@nestjs/common';
import { Response } from 'express';
import { FileSystemService } from './files.service';
import { AdminHeaderGuard } from 'src/roles/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('files')
export class FilesController {
  constructor(private readonly fileSystemService: FileSystemService) {}
  @Get(':path')
  async listFilesAndDirectories(
    @Param('path') path?: string,
    @Headers('role') role?: string,
  ): Promise<string[]> {
    return this.fileSystemService.listFilesAndDirectories(path, role);
  }

  @Get('content/:path/:filename')
  getFileContent(
    @Param('filename') fileName: string,
    @Param('path') path?: string,
    @Headers('role') role?: string,
  ): Promise<string> {
    return this.fileSystemService.readFileContent(fileName, path, role);
  }

  @Post('createpath')
  @UseGuards(AdminHeaderGuard)
  createPath(@Body('path') path: string): string {
    return this.fileSystemService.createNewDirectory(path);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Body('path') path: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 1000000 })], // Almost 1mb
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.fileSystemService.saveUploadedFile(file, path);
  }

  @Post('video/upload')
  @UseInterceptors(FileInterceptor('video'))
  async uploadVideo(
    @Body('path') path: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 10000000 })], // Almost 10mb
      }),
    )
    video: Express.Multer.File,
  ) {
    return this.fileSystemService.saveUploadedFile(video, path);
  }

  @Get('stream/:path')
  @UseInterceptors(FileInterceptor('video'))
  async streamVideo(
    @UploadedFile() video: Express.Multer.File,
    @Res() res: Response,
    @Param('path') path?: string,
  ) {
    return this.fileSystemService.streamVideo(video, res, path);
  }

  @Delete('/removefiles')
  async removeFiles(
    @Body('path') path: string,
    @Headers('role') role?: string,
  ) {
    return this.fileSystemService.removeFiles(path, role);
  }
}
