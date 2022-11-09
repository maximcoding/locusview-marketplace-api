import {Connection} from 'mongoose';
import {ModelEnum} from '../../enums/model.enum';
import {DATABASE_PROVIDER} from '../database/database.providers';
import {UserSchema} from './schemas/user.schema';

export const usersProviders = [
    {
        provide: ModelEnum.Users,
        useFactory: (connection: Connection) => connection.model(ModelEnum.Users, UserSchema),
        inject: [DATABASE_PROVIDER],
    },
];
