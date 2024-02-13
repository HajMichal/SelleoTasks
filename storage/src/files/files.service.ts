import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path';
import { writeFile, readFile, readdir } from 'fs/promises';

@Injectable()
export class FileSystemService {
  // TODO: return folder names aswell
  async listFilesAndDirectories(
    path: string,
    role?: string,
  ): Promise<string[]> {
    const decodedPath = decodeURIComponent(path);
    try {
      const files = await readdir(join(process.env.SECRET_PATH, decodedPath));
      if (decodedPath.includes('admin') && role !== 'admin')
        throw { message: 'Not authorized to read this path', statusCode: 401 };
      return files;
    } catch (err) {
      throw err;
    }
  }

  async readFileContent(
    decodedPath: string,
    fileName: string,
    role?: string,
  ): Promise<string> {
    try {
      const content = await readFile(
        join(`${process.env.SECRET_PATH}${decodedPath}`, fileName),
        'utf-8',
      );
      if (decodedPath.includes('admin') && role !== 'admin')
        throw { message: 'Not authorized to read this path', statusCode: 401 };
      return content;
    } catch (err) {
      throw err;
    }
  }

  // TODO: check if folder with this name exists
  // true ==> throw an error
  // false ==> create new directory
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
}
