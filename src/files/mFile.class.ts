// export interface MulterFile extends Express.Multer.File {
//   buffer: Buffer;
//   originalname: string;
// }

export class MFile {
  buffer: Buffer;
  originalname: string;

  constructor(file: MFile) {
    this.buffer = file.buffer;
    this.originalname = file.originalname;
  }
}
