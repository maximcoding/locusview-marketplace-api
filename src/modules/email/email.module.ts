import {Module} from '@nestjs/common';
import {SendGridModule} from '@ntegral/nestjs-sendgrid';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {SendgridService} from './sendgrid.service';
import {HandlebarsAdapter} from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import {MailerModule} from '@nestjs-modules/mailer';

import * as handlebars from 'handlebars';

const helpers = {
  handlebarsIntl: (value) => {
    const context = {
      value: value,
    };
    const intlData = {
      locales: ['en-US'],
    };
    // use the formatNumber helper from handlebars-intl
    const template = handlebars.compile('{{formatNumber value}} is the final result!');
    const compiled = template(context, {
      data: {intl: intlData},
    });
    return compiled;
  },
  otherHelper: () => ({}),
};

@Module({
  imports: [
    ConfigModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: process.env.EMAIL_HOST,
          secure: false,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
          },
        },
        defaults: {
          from: process.env.SENDGRID_EMAIL,
        },
        template: {
          dir: process.cwd() + '/templates/',
          adapter: new HandlebarsAdapter(helpers),
          options: {
            strict: true,
          },
        },
        options: {
          partials: {
            dir: process.cwd() + '/templates/',
            options: {
              strict: true,
            },
          },
        },
      }),
      inject: [ConfigService],
    }),
    SendGridModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        apiKey: process.env.SENDGRID_API_KEY,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [SendgridService],
  exports: [SendgridService],
})
export class EmailModule {}
