import {CacheModule, MiddlewareConsumer, Module} from '@nestjs/common';
import {ThrottlerModule} from '@nestjs/throttler';
import {ConfigModule} from '@nestjs/config';
import {validate} from '../../env.validation';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ProjectsModule} from '../projects/projects.module';
import {AuthModule} from '../auth/auth.module';
import {UserModule} from '../users/user.module';
import {SmsModule} from '../sms/sms.module';
import {EmailModule} from '../email/email.module';
import {FilesModule} from '../files/files.module';
import {APP_INTERCEPTOR} from '@nestjs/core';
import {LoggingInterceptor} from '../../interceptors/logging.interceptor';
import {SeederModule} from 'nestjs-seeder/dist/seeder/seeder.module';
import {MongoCacheModule} from '../cache/mongo-cache.module';
import {CompaniesModule} from "../companies/companies.module";

@Module({
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
  imports: [
    AuthModule,
    UserModule,
    ProjectsModule,
    CompaniesModule,
    FilesModule,
    SeederModule,
    MongoCacheModule,
    ThrottlerModule.forRoot({
      ttl: +process.env.TROTTLER_TTL,
      limit: +process.env.TROTTLER_LIMIT,
    }),
    ConfigModule.forRoot({
      envFilePath: ['.env.development', '.env'],
      expandVariables: true,
      isGlobal: true,
      cache: true,
      validate,
    }),
    SmsModule,
    EmailModule,
  ],
  exports: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {}
}
