import { Connection } from 'mongoose';
import { ModelEnum } from '../../enums/model.enum';
import { DATABASE_PROVIDER } from '../database/database.providers';
import { ArticleSchema } from './schemas/article.schema';

export const ARTICLE_MODEL = 'ARTICLE_MODEL';

export const articleProviders = [
  {
    provide: ARTICLE_MODEL,
    useFactory: (connection: Connection) =>
      connection.model(ModelEnum.Examples, ArticleSchema),
    inject: [DATABASE_PROVIDER],
  },
];
