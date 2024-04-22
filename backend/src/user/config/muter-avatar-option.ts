import { HttpException, HttpStatus } from '@nestjs/common';
import { extname } from 'path';

export const multerAvatarConfig = {
  dest: './uploads/images/avatars',
};

export const multerAvatarOptions = {
  fileFilter: (req, file, cb) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
      cb(null, true);
    } else {
      cb(
        new HttpException(
          `Unsupported file type ${extname(file.originalname)}`,
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }
  },
};
