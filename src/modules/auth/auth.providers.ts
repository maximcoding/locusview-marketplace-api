import {Connection} from 'mongoose';
import {ModelEnum} from '../../enums/model.enum';
import {DATABASE_PROVIDER} from '../database/database.providers';
import {ResetPassSchema} from './schemas/reset-pass.schema';

export const FORGOT_PASS = 'FORGOT_PASS';
export const RESET_PASS = 'RESET_PASS';

export const authProviders = [
  {
    provide: RESET_PASS,
    useFactory: (connection: Connection) => connection.model(ModelEnum.ResetPassword, ResetPassSchema),
    inject: [DATABASE_PROVIDER],
  },
];
