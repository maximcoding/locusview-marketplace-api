import {HttpAdapterHost, NestFactory} from '@nestjs/core';
import {AppModule} from './modules/app/app.module';
import {SwaggerModule, DocumentBuilder} from '@nestjs/swagger';
import {HttpStatus, ValidationPipe} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {MongoExceptionFilter} from './filters/mongo-exception.filter';
import {AllExceptionsFilter} from './filters/all-exceptions.filter';
import {LoggingInterceptor} from './interceptors/logging.interceptor';
import {TransformDataInterceptor} from './interceptors/transform-data.interceptor';
import {ExcludeNullInterceptor} from './interceptors/exclude-null.interceptor';
import {TimeoutInterceptor} from './interceptors/timeout.interceptor';
import {NestExpressApplication} from '@nestjs/platform-express';

// const RedisStore = require('connect-redis')(session);
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');

import * as session from 'express-session';
import fs = require('fs');
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import {config} from 'aws-sdk';
import * as csurf from 'csurf';
import * as helmet from 'helmet';
import * as passport from 'passport';

const httpsOptions = {
  // key: fs.readFileSync(__dirname + '/../ssl/keys/localhost.pem', 'utf8'),
  // cert: fs.readFileSync(__dirname + '/../ssl/keys/localhost.cert', 'utf8'),
};

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
    bodyParser: true,
    httpsOptions: null,
  });

  const configService = app.get(ConfigService);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidUnknownValues: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    }),
  );
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    // new ErrorsInterceptor(), // not working
    new ExcludeNullInterceptor(),
    new TimeoutInterceptor(),
    new TransformDataInterceptor(),
  );
  const {httpAdapter} = app.get(HttpAdapterHost);

  app.useGlobalFilters(new MongoExceptionFilter(), new AllExceptionsFilter(httpAdapter));
  config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });
  app.use(helmet());
  // const whitelist = configService.get('ALLOWED_ORIGINS')?.split(/\s*,\s*/) ?? '*';
  const whitelist = ['https://locusview-for-everyone.herokuapp.com', 'http://localhost:8080', 'http://localhost:3000'];
  app.enableCors({
    origin: whitelist,
    credentials: true,
    methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    allowedHeaders: 'Origin, Content-type, Accept, Authorization, x-xsrf-token',
    exposedHeaders: ['Authorization'],
  });
  // app.use(csurf({cookie: true}));
  // const redisURL = `redis://:${process.env.REDIS_PASS}@localhost:${process.env.REDIS_PORT_OUT}`;
  // const cookieMaxAge = 1000 * 60 * 60 * 24 * 7;
  // const redisStore = new RedisStore({
  //   client: require('redis').createClient(redisURL),
  //   ttl: cookieMaxAge,
  // });
  const mongoStore = MongoStore.create({
    mongoUrl: process.env.MONGO_DB_URI,
    useUnifiedTopology: true,
    autoRemove: 'interval',
    ttl: 604800,
    autoRemoveInterval: 10080,
    touchAfter: 1,
  });
  app.use(cookieParser(process.env.SECRET_COOKIE_SESSION));
  app.use(
    session({
      store: mongoStore,
      saveUninitialized: false,
      secret: process.env.SECRET_COOKIE_SESSION,
      resave: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        sameSite: 'none', // 'strict'
        signed: true,
        secure: false,
      },
    }),
  );
  app.use(flash());
  app.use(passport.initialize());
  // middleware is to deserialize user object from session using passport.deserializeUser
  // function (that you define in your passport configuration).
  // When user first authenticates itself, its user object is serialized and stored in the session
  app.use(passport.session());
  app.use(compression());
  app.setGlobalPrefix('/api');
  swaggerSetup(app);
  const HOST = process.env.HOST || '0.0.0.0';
  const server = app.listen(process.env.PORT || 5000, () => {
    console.log(`Explore api on http://${HOST}:${process.env.PORT || 5000}/api`);
  });
}

function swaggerSetup(app) {
  const config = new DocumentBuilder()
    .setTitle('REST API Design')
    .setDescription('Explore and test Locusview for everyone API endpoints')
    .setVersion('1.0')
    // .addBasicAuth()
    // .addCookieAuth('optional-session-id')
    .addBearerAuth()
    .addTag('Endpoints')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}

bootstrap();
