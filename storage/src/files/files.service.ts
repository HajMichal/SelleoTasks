import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path';
import { writeFile, readFile, readdir, unlink, rmdir } from 'fs/promises';
import { Response } from 'express';

function checkIsAdmin(path: string, role?: string) {
  if (path.includes('admin') && role !== 'admin')
    throw { message: 'Not authorized to read this path', statusCode: 401 };
  return;
}

@Injectable()
export class FileSystemService {
  async listFilesAndDirectories(
    path?: string,
    role?: string,
  ): Promise<string[]> {
    const decodedPath = decodeURIComponent(path);
    const defaultPath = join(process.env.SECRET_PATH, decodedPath);
    try {
      const files: string[] = await readdir(defaultPath);
      checkIsAdmin(decodedPath, role);
      return files;
    } catch (err) {
      throw err;
    }
  }

  async readFileContent(
    fileName: string,
    path?: string,
    role?: string,
  ): Promise<string> {
    const decodedPath = decodeURIComponent(path);
    try {
      const content = await readFile(
        join(`${process.env.SECRET_PATH}${decodedPath}`, fileName),
        'utf-8',
      );
      checkIsAdmin(decodedPath, role);
      return content;
    } catch (err) {
      throw err;
    }
  }

  createNewDirectory(path: string): string {
    try {
      fs.mkdirSync(`${process.env.SECRET_PATH}${path}`, {
        recursive: true,
      });
      return 'Direcotry is created properly';
    } catch (err) {
      throw {
        message: `Error reading directory: SECRET_PATH/${path}`,
        statusCode: 409,
      };
    }
  }

  async saveUploadedFile(
    file: Express.Multer.File,
    path: string,
  ): Promise<string> {
    const directory = join(process.env.SECRET_PATH, path, file.originalname);

    try {
      await writeFile(directory, file.buffer);
      return file.originalname + ' file was saved';
    } catch (err) {
      throw {
        message: `Error reading directory: SECRET_PATH/${path}`,
        statusCode: 404,
      };
    }
  }

  async streamVideo(video: Express.Multer.File, res: Response, path?: string) {
    const decodedPath = decodeURIComponent(path);
    const directory = join(
      process.env.SECRET_PATH,
      decodedPath,
      video.originalname,
    );
    if (!fs.existsSync(directory))
      throw new NotFoundException('File in this directory not found');

    res.setHeader('Content-Type', 'video/mp4');

    const stream = fs.createReadStream(directory);
    return stream.pipe(res);
  }

  async removeFiles(path: string, role?: string) {
    const defaultPath = join(process.env.SECRET_PATH, path);
    try {
      checkIsAdmin(path, role);
      if (path.includes('.')) await unlink(defaultPath);
      else await rmdir(defaultPath);
      return {
        message: 'File was removed correctly',
        statusCode: 200,
      };
    } catch (err) {
      throw err;
    }
  }
}
