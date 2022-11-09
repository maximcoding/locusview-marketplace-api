import {IAwsFile} from '../modules/files/aws-file.schema';
import {BadRequestException, PayloadTooLargeException} from '@nestjs/common';

export const limitMax4Files = (files: Express.Multer.File[] | IAwsFile[]) => {
  if (files.length > 4) {
    throw new PayloadTooLargeException('max 5 files');
  }
};
