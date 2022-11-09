import {Connection} from 'mongoose';
import {ModelEnum} from '../../enums/model.enum';
import {ProjectsSchema} from './projects.schema';
import {DATABASE_PROVIDER} from '../database/database.providers';

export const projectsProviders = [
  {
    provide: ModelEnum.Projects,
    useFactory: (connection: Connection) => connection.model(ModelEnum.Projects, ProjectsSchema),
    inject: [DATABASE_PROVIDER],
  },
];
