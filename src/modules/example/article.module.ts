import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { articleProviders } from './article.provider';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../database';

@Module({
  imports: [ConfigModule, DatabaseModule],
  controllers: [ArticleController],
  providers: [ArticleService, ...articleProviders],
})
export class ArticleModule {}
