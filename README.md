## Description
LocusView For Everyone REST API

## Installation

```
create .env

#mongo uri
MONGO_DB_URI=mongodb+srv://{USERNAME}:{PASSWORD}@cluster0.cauco.mongodb.net/{DB_NAME}?retryWrites=true&w=majority

TROTTLER_TTL = 60
TROTTLER_LIMIT = 10

#jwt
JWT_SECRET_KEY = 
JWT_SECRET_TOKEN=
JWT_SECRET_TOKEN_EXP =

#redis
REDIS_HOST=
REDIS_PORT=6379
REDIS_USERNAME=
REDIS_PASSWORD=
CACHE_TTL=
REDIS_URI=

#AWS S3
AWS_PUBLIC_BUCKET_NAME=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=

#twillio
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

#sendgrid email
SENDGRID_API_KEY=
SENDGRID_EMAIL=
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
