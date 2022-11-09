import * as mongoose from 'mongoose';
import * as chalk from 'chalk';
import {ConfigService} from '@nestjs/config';
import {EnvironmentVariables} from '../../env.validation';

export const DATABASE_PROVIDER = 'DATABASE_PROVIDER';

export const databaseProviders = [
  {
    provide: DATABASE_PROVIDER,
    useFactory: (service: ConfigService<EnvironmentVariables>): Promise<typeof mongoose> => {
      const mongoUri = process.env.MONGO_DB_URI;

      mongoose.connection.on('connected', () => {
        console.log(chalk.greenBright('mongoose connected %s'), mongoUri);
      });

      mongoose.connection.on('error', (err) => {
        console.log(chalk.greenBright('mongoose error %s', err), mongoUri);
      });

      const options = {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
        // Automatically try to reconnect when it loses connection to MongoDB
        autoReconnect: true,
        // Never stop trying to reconnect
        reconnectTries: Number.MAX_VALUE,
        // Reconnect every 500ms
        reconnectInterval: 500,
        // Maintain up to 10 socket connections. If not connected,
        // return errors immediately rather than waiting for reconnect
        poolSize: 10,
        // Give up initial connection after 10 seconds
        connectTimeoutMS: 10000,
      };
      return mongoose.connect(mongoUri, options).catch((err) => {
        console.log(chalk.redBright('mongoose error %s'), err);
        process.exit(1);
      });
    },
    inject: [ConfigService],
  },
];
