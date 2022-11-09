import {CACHE_MANAGER, CacheModule, Inject, Logger, Module, OnModuleInit} from '@nestjs/common';
import {Cache} from 'cache-manager';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {CacheService} from './cache.service';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT_OUT,
        password: process.env.REDIS_PASS,
        ttl: 120,
      }),
    }),
  ],
  providers: [CacheService],
  exports: [RedisCacheModule, CacheService],
})
export class RedisCacheModule implements OnModuleInit {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  public onModuleInit(): any {
    const logger = new Logger('Cache');
  }
}
