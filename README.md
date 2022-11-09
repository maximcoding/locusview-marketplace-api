## Description
LocusView For Everyone REST API

## Installation

```
create .env

MONGO_DB_URI=mongodb+srv://user:pass123@cluster0.cauco.mongodb.net/dbName?retryWrites=true&w=majority
TROTTLER_TTL = 60
TROTTLER_LIMIT = 10

JWT_SECRET_KEY = 'someSecretKey'
JWT_SECRET_TOKEN=7ac814f4e59ca19d216a1043671afa683270b12dfbf1d73139b3f25ec70b8e27f0f91d575cf6e48fe2897892227851d8a5cffa417a318bd6a60f682f8bac2ee5
JWT_SECRET_TOKEN_EXP = 1d

APP_PORT = 3000
APP_HOST = 127.0.0.1
APP_NAME = gagotapp
APP_REQUEST_TIME_OUT=30000
APP_MAX_FILE_SIZE=25000000
ALLOWED_ORIGINS=http://localhost:3000

BCRYPT_SALT = 10
SECRET_COOKIE_SESSION=yoursupersecretkey
SESSION_TIME=86400000

#redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_USERNAME='redisuser'
REDIS_PASSWORD='redispass'
CACHE_TTL=180000
REDIS_URI=

#s3
AWS_PUBLIC_BUCKET_NAME=someBucketName
AWS_ACCESS_KEY_ID=somekeyId
AWS_SECRET_ACCESS_KEY=someAccessKey

#twillio
TWILIO_ACCOUNT_SID=someSID
TWILIO_AUTH_TOKEN=someTOKEN
TWILIO_PHONE_NUMBER=somephonenumber

#sendgrid email
SENDGRID_API_KEY=SG.whatever
SENDGRID_EMAIL=someemail
```

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
