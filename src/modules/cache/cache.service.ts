import {CACHE_MANAGER, Inject, Injectable} from '@nestjs/common';
import {Cache} from 'cache-manager';

export enum CacheKeys {
  white_list = 'white_list_',
}

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
    // this.cacheManager.reset(); // await
  }

  public async get(key: string) {
    return await this.cacheManager.get(key);
  }

  public async set(key: string, value: any, seconds?: number) {
    await this.cacheManager.set(key, value, seconds);
  }

  public async del(key: any) {
    await this.cacheManager.del(key);
  }

  public async whiteListJWTToken(userId: string, jwtToken: string) {
    await this.blackListJWTToken(userId);
    const usersCache = await this.get(CacheKeys.white_list + userId);
    const obj = usersCache ? usersCache : {};
    obj[jwtToken] = true;
    await this.set(CacheKeys.white_list + userId, obj, 604800);
  }

  public async blackListJWTToken(userId: string) {
    const usersCache = await this.get(CacheKeys.white_list + userId);
    const obj = {};
    if (usersCache) {
      Object.keys(usersCache).forEach((token) => {
        obj[token] = false;
      });
    }
    await this.set(CacheKeys.white_list + userId, obj);
  }
}
