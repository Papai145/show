import {
  Controller,
  HttpCode,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileElementResponse } from './dto/file-element-response';
import { JwtAdminAuthGuard } from 'src/auth/guards/jwt-admin-auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { MFile } from './mFile.class';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}
  @Post('upload')
  @HttpCode(200)
  @UseGuards(JwtAdminAuthGuard)
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB на файл
      },
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
          return callback(new Error('Only images are allowed'), false);
        }
        callback(null, true);
      },
    }),
  )
  async uploadFile(
    @UploadedFiles() files: Array<MFile & { mimetype: string }>,
  ): Promise<FileElementResponse[]> {
    const saveArray: MFile[] = [];
    for (const file of files) {
      if (file.mimetype.includes('image')) {
        const buffer = await this.filesService.convertToWebP(file.buffer);
        saveArray.push(
          new MFile({
            originalname: `${file.originalname.split('.')[0]}.webp`,
            buffer,
          }),
        );
      }
      saveArray.push(new MFile(file));
    }
    return this.filesService.saveFiles(saveArray);
  }
}
