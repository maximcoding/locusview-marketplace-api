import {BadRequestException, Injectable} from '@nestjs/common';
import {IUser} from '../users/interfaces/user.interface';
import {ConfigService} from '@nestjs/config';
import {InjectSendGrid, SendGridService} from '@ntegral/nestjs-sendgrid';
import {MailerService} from '@nestjs-modules/mailer';

@Injectable()
export class SendgridService {
  constructor(
    @InjectSendGrid() private readonly sendGridClient: SendGridService,
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  public async sendEmailConfirmationCode(user: IUser, code: string) {
    try {
      return await this.mailerService.sendMail({
        to: user.email,
        subject: `Confirm your ${process.env.APP_NAME} email account`,
        template: 'email-confirmation',
        context: {
          code: code,
          firstName: user.firstName,
        },
      });
    } catch (e) {
      throw new BadRequestException('Email sent Failed', e);
    }
  }

  public async sendResetToken(user: IUser, token: string) {
    try {
      return await this.mailerService.sendMail({
        to: user.email,
        subject: `Resetting your ${process.env.APP_NAME} password`,
        template: 'password-reset',
        context: {
          token: token,
          firstName: user.firstName,
        },
      });
    } catch (e) {
      throw new BadRequestException('Email sent Failed', e);
    }
  }

  public async resetPasswordSuccess(user: IUser): Promise<BadRequestException | any> {
    // template/resetPassword.handlebars
    const msg = {
      to: user.email,
      from: this.configService.get('SENDGRID_EMAIL'),
      subject: `Password Reset ${process.env.APP_NAME} Successfully`,
      html: `<h1>Password Reset Done</h1>
        <h2>Hello ${user.firstName}</h2>
        <p>Your password reset successfully completed</p>
        </div>`,
    };
    try {
      return this.sendGridClient.send(msg);
    } catch (e) {
      throw new BadRequestException('Email sent Failed', e);
    }
  }
}
