import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as uuid from 'uuid';
import * as path from 'path';
import { MemoryStoredFile } from 'nestjs-form-data';
import * as fs from 'fs';
import * as sharp from 'sharp';

@Injectable()
export class FileManagerService {
  private decodeFile(
    directory: string,
    file,
    fileName,
  ): { fileName: string; filePath: string; isImage: boolean } {
    let fileExtension = '';
    let isImage = false;

    if (file?.originalName) {
      fileExtension = file.originalName.split('.').pop();
      if (file.busBoyMimeType.startsWith('image')) isImage = true;
    } else {
      fileExtension = file.originalname.split('.').pop();
      if (file.mimetype.startsWith('image')) isImage = true;
    }
    fileName = fileName || `${uuid.v4()}.${fileExtension}`;
    const filePath = path.resolve(__dirname, '..', '..', 'static', directory);

    return { fileName, filePath, isImage };
  }

  async createFile(
    directory: string,
    file: Express.Multer.File | MemoryStoredFile,
    optimizeImage = true,
    name?: string,
  ): Promise<string> {
    try {
      const { filePath, fileName, isImage } = this.decodeFile(
        directory,
        file,
        name,
      );
      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }
      // Check if the file is an image (based on MIME type)
      if (isImage && optimizeImage) {
        // Convert image to WebP format using sharp
        const webpFileName = `${fileName.split('.')[0]}.webp`;
        await sharp(file.buffer)
          .webp({ effort: 5 })
          .toFile(path.resolve(filePath, webpFileName));
        return `${directory}${directory.endsWith('/') ? '' : '/'}${webpFileName}`;
      }

      // If it's not an image, just save it with the original extension
      fs.writeFileSync(path.resolve(filePath, fileName), file.buffer);
      return `${directory}/${fileName}`;
    } catch (e) {
      console.error(e);
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  removeFile(fileName, throwOnError = true) {
    const filePath = path.resolve(__dirname, '..', '..', 'static', fileName);
    if (!fs.existsSync(filePath) && throwOnError) {
      throw new HttpException(
        { message: `The file "${fileName}" does not exist` },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (fs.existsSync(filePath)) {
      fs.rmSync(filePath);
    }
  }

  async createUserAvatar(
    directory: string,
    file: Express.Multer.File | MemoryStoredFile,
    name?: string,
  ) {
    try {
      const { filePath, fileName } = this.decodeFile(directory, file, name);
      const metadata = await sharp(file.buffer).metadata();
      const width = metadata.width;
      const height = metadata.height;

      const sideLength = Math.min(width, height);
      const left = Math.floor((width - sideLength) / 2);
      const top = Math.floor((height - sideLength) / 2);

      await sharp(file.buffer)
        .extract({ left, top, width: sideLength, height: sideLength })
        .webp({ effort: 5 })
        .toFile(path.resolve(filePath, fileName));
      return `${directory}/${fileName}`;
    } catch (e) {
      console.error(e);
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async readJSONFile(
    file: Express.Multer.File | MemoryStoredFile,
  ): Promise<any> {
    try {
      const jsonData = JSON.parse(file.buffer.toString());
      return jsonData;
    } catch (e) {
      throw new HttpException(
        'Failed to read JSON file',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
