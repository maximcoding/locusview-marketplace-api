import { Inject, Injectable } from '@nestjs/common';
import * as chalk from 'chalk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private config: ConfigService) {}

  root(): string {
    return this.config.get('APP_URL');
  }

  ping(): string {
    const time = new Date().toUTCString();
    console.log(chalk.yellow('server ping check #s', time));
    return 'Server Time: ' + time;
  }
}
