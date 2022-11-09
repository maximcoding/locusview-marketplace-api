import {CACHE_MANAGER, CacheModule, Inject, Logger, Module, OnModuleInit} from '@nestjs/common';
import {Cache} from 'cache-manager';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {CacheService} from './cache.service';
import * as mongoStore from 'cache-manager-mongoose';
import * as mongoose from 'mongoose';
import {ModelEnum} from '../../enums/model.enum';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        store: mongoStore,
        connection: mongoose.createConnection(process.env.MONGO_DB_URI, {
          useUnifiedTopology: true,
          useNewUrlParser: true,
          useCreateIndex: true,
        }),
        mongoose: mongoose,
        modelName: ModelEnum.Cache,
        modelOptions: {
          collection: 'cache',
          versionKey: false, // do not create __v field
        },
      }),
    }),
  ],
  providers: [CacheService],
  exports: [MongoCacheModule, CacheService],
})
export class MongoCacheModule implements OnModuleInit {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  public onModuleInit(): any {
    const logger = new Logger('Cache');
  }
}
