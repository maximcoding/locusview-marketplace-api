import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

import { Article } from './interfaces/article.interface';
import { CreateArticleDto } from './dto/create-article.dto';
import { ARTICLE_MODEL } from './article.provider';

@Injectable()
export class ArticleService {
  constructor(
    @Inject(ARTICLE_MODEL) private readonly articleModel: Model<Article>,
  ) {}

  // ┌─┐┬─┐┌─┐┌─┐┌┬┐┌─┐  ┌─┐┬─┐┌┬┐┬┌─┐┬  ┌─┐
  // │  ├┬┘├┤ ├─┤ │ ├┤   ├─┤├┬┘ │ ││  │  ├┤
  // └─┘┴└─└─┘┴ ┴ ┴ └─┘  ┴ ┴┴└─ ┴ ┴└─┘┴─┘└─┘

  async createArticle(createArticleDto: CreateArticleDto): Promise<Article> {
    const article = new this.articleModel(createArticleDto);
    await article.save();
    return article;
  }

  // ┌─┐┌─┐┌┬┐  ┌─┐┬  ┬    ┌─┐┬─┐┌┬┐┬┌─┐┬  ┌─┐┌─┐
  // │ ┬├┤  │   ├─┤│  │    ├─┤├┬┘ │ ││  │  ├┤ └─┐
  // └─┘└─┘ ┴   ┴ ┴┴─┘┴─┘  ┴ ┴┴└─ ┴ ┴└─┘┴─┘└─┘└─┘
  async getAllArticles(): Promise<any> {
    return this.articleModel.find({});
  }

  // ┌─┐┌─┐┌┬┐  ┌─┐┌┐┌┌─┐  ┌─┐┬─┐┌┬┐┬┌─┐┬  ┌─┐
  // │ ┬├┤  │   │ ││││├┤   ├─┤├┬┘ │ ││  │  ├┤
  // └─┘└─┘ ┴   └─┘┘└┘└─┘  ┴ ┴┴└─ ┴ ┴└─┘┴─┘└─┘
  async getOneArticle(id: string): Promise<Article> {
    return this.articleModel.findById(id);
  }

  // ┬ ┬┌─┐┌┬┐┌─┐┌┬┐┌─┐  ┌─┐┬─┐┌┬┐┬┌─┐┬  ┌─┐    ┌─┐┬  ┬    ┌─┐┌─┐┬─┐┌─┐┌┬┐┌─┐
  // │ │├─┘ ││├─┤ │ ├┤   ├─┤├┬┘ │ ││  │  ├┤     ├─┤│  │    ├─┘├─┤├┬┘├─┤│││└─┐
  // └─┘┴  ─┴┘┴ ┴ ┴ └─┘  ┴ ┴┴└─ ┴ ┴└─┘┴─┘└─┘    ┴ ┴┴─┘┴─┘  ┴  ┴ ┴┴└─┴ ┴┴ ┴└─┘  \
  async updateArticlePut(
    id: string,
    createArticleDto: CreateArticleDto,
  ): Promise<any> {
    return this.articleModel.updateOne({ _id: id }, createArticleDto);
  }

  // ┌┬┐┌─┐┬  ┌─┐┌┬┐┌─┐  ┌─┐┌┐┌┌─┐  ┌─┐┬─┐┌┬┐┬┌─┐┬  ┌─┐
  //  ││├┤ │  ├┤  │ ├┤   │ ││││├┤   ├─┤├┬┘ │ ││  │  ├┤
  // ─┴┘└─┘┴─┘└─┘ ┴ └─┘  └─┘┘└┘└─┘  ┴ ┴┴└─ ┴ ┴└─┘┴─┘└─┘
  async deleteArticle(id: string): Promise<Article> {
    return this.articleModel.findByIdAndDelete(id);
  }
}
