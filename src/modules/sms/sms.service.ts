import {BadRequestException, Injectable} from '@nestjs/common';
import {IUser} from '../users/interfaces/user.interface';
import {InjectTwilio, TwilioClient} from 'nestjs-twilio';
import {ConfigService} from '@nestjs/config';

@Injectable()
export class SmsService {
  constructor(private configService: ConfigService, @InjectTwilio() private readonly twilioClient: TwilioClient) {}

  public async sendSMSCode(mobilePhone: string, code: number): Promise<any> {
    try {
      return await this.twilioClient.messages.create({
        body: `הקוד האימות הוא ${code}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: mobilePhone,
      });
    } catch (e) {
      throw new BadRequestException('SMS code sent Failed', e);
    }
  }
}
