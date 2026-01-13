import {
  Controller,
  Post,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync, unlinkSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';

const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';

// uploads 폴더 생성
if (!existsSync(UPLOAD_DIR)) {
  mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = diskStorage({
  destination: UPLOAD_DIR,
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const imageFileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
    return cb(new BadRequestException('이미지 파일만 업로드 가능합니다'), false);
  }
  cb(null, true);
};

@Controller('upload')
export class UploadController {
  @Post('image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage,
      fileFilter: imageFileFilter,
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }),
  )
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('파일이 없습니다');
    }

    return {
      filename: file.filename,
      url: `/uploads/${file.filename}`,
    };
  }

  @Delete('image/:filename')
  deleteImage(@Param('filename') filename: string) {
    const filePath = join(UPLOAD_DIR, filename);

    if (!existsSync(filePath)) {
      throw new NotFoundException('파일을 찾을 수 없습니다');
    }

    try {
      unlinkSync(filePath);
      return { message: '삭제되었습니다' };
    } catch {
      throw new BadRequestException('파일 삭제에 실패했습니다');
    }
  }
}
