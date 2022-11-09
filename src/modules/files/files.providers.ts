import {Connection} from 'mongoose';
import {ModelEnum} from '../../enums/model.enum';
import {AwsFileSchema} from './aws-file.schema';
import {DATABASE_PROVIDER} from '../database/database.providers';

export const FILE_MODEL = 'FILE_MODEL';

export const filesProviders = [
  {
    provide: FILE_MODEL,
    useFactory: (connection: Connection) => connection.model(ModelEnum.Files, AwsFileSchema),
    inject: [DATABASE_PROVIDER],
  },
];
