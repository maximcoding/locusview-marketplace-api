import {Module} from '@nestjs/common';
import {TwilioModule} from 'nestjs-twilio';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {SmsService} from './sms.service';

@Module({
  imports: [
    TwilioModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        accountSid: process.env.TWILIO_ACCOUNT_SID,
        authToken: process.env.TWILIO_AUTH_TOKEN,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [SmsService],
  exports: [SmsService],
})
export class SmsModule {}
