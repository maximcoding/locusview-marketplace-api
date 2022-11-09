import {Connection} from 'mongoose';
import {ModelEnum} from '../../enums/model.enum';
import {DATABASE_PROVIDER} from '../database/database.providers';
import {ProjectsTypesSchema} from './projects-types.schema';

export const categoriesProviders = [
  {
    provide: ModelEnum.ProjectsTypes,
    useFactory: (connection: Connection) => connection.model(ModelEnum.ProjectsTypes, ProjectsTypesSchema),
    inject: [DATABASE_PROVIDER],
  },
];
