import {Connection} from 'mongoose';
import {ModelEnum} from '../../enums/model.enum';
import {DATABASE_PROVIDER} from '../database/database.providers';
import {CompaniesSchema} from "./companies.schema";

export const companiesProvider = [
  {
    provide: ModelEnum.Companies,
    useFactory: (connection: Connection) => connection.model(ModelEnum.Companies, CompaniesSchema),
    inject: [DATABASE_PROVIDER],
  },
];
