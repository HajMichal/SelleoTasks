import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class FileSystemService {
  // TODO: return folder names aswell
  async listFilesAndDirectories(path: string): Promise<string[]> {
    const decodedPath = decodeURIComponent(path);
    return new Promise((resolve, reject) => {
      fs.readdir(`${process.env.SECRET_PATH}${decodedPath}`, (err, files) => {
        if (err)
          reject({
            message: `Error reading directory: SECRET_PATH/${decodedPath}`,
            statusCode: 404,
          });
        else resolve(files);
      });
    });
  }

  async getFileContent(path: string, fileName: string): Promise<string> {
    const decodedPath = decodeURIComponent(path);

    return new Promise((resolve, reject) => {
      fs.readFile(
        join(`${process.env.SECRET_PATH}${decodedPath}`, fileName),
        'utf-8',
        (err, content) => {
          if (err)
            reject({
              message: `Error reading directory: SECRET_PATH/${decodedPath}`,
              statusCode: 404,
            });
          else resolve(content);
        },
      );
    });
  }
  // TODO: check if folder with this name exists
  // true ==> return error
  // false ==> create new directory
  createNewDirectory(path: string): string {
    const decodedPath = decodeURIComponent(path);
    try {
      fs.mkdirSync(`${process.env.SECRET_PATH}${decodedPath}`, {
        recursive: true,
      });
      return 'Direcotry is created properly';
    } catch (err) {
      throw {
        message: `Error reading directory: SECRET_PATH/${decodedPath}`,
        statusCode: 409,
      };
    }
  }
}
