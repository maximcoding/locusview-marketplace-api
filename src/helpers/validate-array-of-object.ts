import {BadRequestException} from '@nestjs/common';
import {ObjectId} from 'mongoose';

export const validateArrayOfObjectIds = (values: ObjectId[]) => {
  values.forEach((value: ObjectId) => {
    const objectIdRegEx = new RegExp('^[0-9a-fA-F]{24}$');
    if (!objectIdRegEx.test(value.toString())) {
      throw new BadRequestException('Invalid some Object id');
    }
  });
};