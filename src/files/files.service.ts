import { Injectable } from '@nestjs/common';
import { FileElementResponse } from './dto/file-element-response';
import { format } from 'date-fns';
import { path } from 'app-root-path';
import { ensureDir, writeFile } from 'fs-extra';
import * as sharp from 'sharp';
import { MFile } from './mFile.class';

@Injectable()
export class FilesService {
  async saveFiles(files: MFile[]): Promise<FileElementResponse[]> {
    const dateFolder = format(new Date(), 'yyyy-MM-dd');
    const uploadFolder = `${path}/uploads/${dateFolder}`;
    await ensureDir(uploadFolder);
    const res: FileElementResponse[] = [];
    for (const file of files) {
      const processedBuffer = await this.resizeImage(file.buffer);
      await writeFile(`${uploadFolder}/${file.originalname}`, processedBuffer);
      res.push({
        url: `${dateFolder}/${file.originalname}`,
        name: file.originalname,
      });
    }
    return res;
  }
  private async resizeImage(buffer: Buffer): Promise<Buffer> {
    return sharp(buffer)
      .resize({
        width: 500,
        fit: sharp.fit.inside,
        withoutEnlargement: true,
      })
      .toBuffer();
  }
  async convertToWebP(buffer: Buffer): Promise<Buffer> {
    return await sharp(buffer).webp().toBuffer();
  }
}
