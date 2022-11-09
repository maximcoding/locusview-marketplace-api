import {JwtPayload} from './interfaces/jwt-payload.interface';
import {
  Injectable,
  UnauthorizedException,
  Inject,
  forwardRef,
  NotFoundException,
  ConflictException,
  BadRequestException,
  HttpStatus,
  ForbiddenException,
  CACHE_MANAGER,
} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {Model} from 'mongoose';
import {sign} from 'jsonwebtoken';
import {Request} from 'express';
import {getClientIp} from 'request-ip';
import {ConfigService} from '@nestjs/config';
import {UserService} from '../users/services/user.service';
import {VerifyMobilePhonePayload} from '../users/payloads/verify-phone.payload';
import {LoginWithEmailPayload} from '../users/payloads/login.payloads';
import {IUser} from '../users/interfaces/user.interface';
import {ResetPasswordPayload} from '../users/payloads/reset-password.payload';
import {ResetPassword} from './schemas/reset-pass.schema';
import {
  RegisterPayload,
  EmailConfirmationPayload,
  MobileVerificationPayload,
} from '../users/payloads/register.payloads';
import {addHours, addMinutes} from 'date-fns';
import * as bcrypt from 'bcrypt';
import * as Cryptr from 'cryptr';
import {RESET_PASS} from './auth.providers';
import {SmsService} from '../sms/sms.service';
import {SendgridService} from '../email/sendgrid.service';
import {UserDocument} from '../users/schemas/user.schema';
import {PHONE_LOCAL_STRATEGY_FIELD} from './strategies/local.strategy';
import {CacheService} from '../cache/cache.service';
import {UserStatusEnum} from '../../enums/user-status.enum';
import {comparePass, create6DigitsCode} from '../../helpers/password-hash';

const KEY = 'hello';

@Injectable()
export class AuthService {
  MINUTES_TO_VERIFY_MOBILE_PHONE = 2;
  HOURS_TO_VERIFY_EMAIL_ADDRESS = 2;
  HOURS_TO_BLOCK = 24;
  LOGIN_ATTEMPTS_TO_BLOCK = 5;

  constructor(
    @Inject(RESET_PASS)
    private readonly resetPassModel: Model<ResetPassword>,
    private readonly jwtService: JwtService,
    private smsService: SmsService,
    private emailService: SendgridService,
    private configService: ConfigService,
    private redisCache: CacheService,
    @Inject(forwardRef(() => UserService)) private userService: UserService,
  ) {}

  // working
  public async register(payload: RegisterPayload): Promise<IUser> {
    this.passwordAndConfirmMatch(payload.password, payload.confirmPassword);
    const newUser = await this.userService.create(payload);
    if (newUser[PHONE_LOCAL_STRATEGY_FIELD]) {
      this.setMobileVerificationCode(newUser);
      await this.smsService.sendSMSCode(newUser.mobilePhone, newUser.mobilePhoneVerificationCode);
    }
    if (newUser.email) {
      this.setEmailConfirmationCode(newUser);
      await this.emailService.sendEmailConfirmationCode(newUser, newUser.emailConfirmationCode);
    }
    return await newUser.save();
  }

  public async addToWhiteListToken(userId: string, jwtToken) {
    await this.redisCache.whiteListJWTToken(userId, jwtToken);
  }

  public async blackListJWTToken(userId: string) {
    await this.redisCache.blackListJWTToken(userId);
  }

  public async sendMobileVerificationCode(payload: MobileVerificationPayload): Promise<void> {
    const user = await this.userService.findByPhoneUnverified(payload.mobilePhone);
    this.setMobileVerificationCode(user);
    await this.smsService.sendSMSCode(user.mobilePhone, user.mobilePhoneVerificationCode);
    await user.save();
  }

  public async sendEmailConfirmation(payload: EmailConfirmationPayload): Promise<void> {
    const user = await this.userService.findByEmailUnverified(payload.email);
    this.setEmailConfirmationCode(user);
    await this.emailService.sendEmailConfirmationCode(user, user.emailConfirmationCode);
    await user.save();
  }

  // working
  public async verifyMobile(smsCode: number): Promise<void> {
    const found = await this.userService.findByPhoneVerification(smsCode);
    await this.userService.setUsersMobilePhoneVerified(found);
  }

  // working
  public async confirmEmail(code: string): Promise<void> {
    const user = await this.userService.findByEmailConfirmationCode(code);
    await this.userService.setUsersEmailConfirmed(user);
  }

  // working
  // working
  public async loginWithPhone(mobilePhone: string): Promise<any> {
    const user = await this.userService.findVerifiedUserByPhone(mobilePhone);
    const jwtToken = this.createSignToken(user._id);
    await this.addToWhiteListToken(user._id, jwtToken);
    return {token: jwtToken};
  }

  // working
  public async loginWithEmail(payload: LoginWithEmailPayload): Promise<{user: IUser; token: string}> {
    const user = await this.userService.findVerifiedUserByEmail(payload.email);
    if (!user) {
      throw new NotFoundException(`There isn't any user with mobile: ${payload.email}`);
    }
    // await this.checkPassword(payload.password, user);
    const jwtToken = this.createSignToken(user._id);
    await this.addToWhiteListToken(user._id, jwtToken);
    return {token: jwtToken, user};
  }

  public async resetPasswordRequest(payload: ResetPasswordPayload): Promise<void> {
    const user = await this.userService.findVerifiedUserByPhone(payload[PHONE_LOCAL_STRATEGY_FIELD]);
    await this.checkPassword(payload.password, user);
    await this.passwordAndNewMatch(payload.password, payload.newPassword);
    await this.resetLoginAttempts(user);
    await this.destroyPreviousResetToken(user._id);
    const tokenModel = await this.initResetToken(user._id, payload.newPassword);
    await this.emailService.sendResetToken(user, tokenModel.emailToken);
    await this.smsService.sendSMSCode(user.mobilePhone, tokenModel.mobileSmsCode);
  }

  public async resetPasswordEmailConfirm({token}): Promise<void> {
    const tokenModel = await this.verifyResetToken(token);
    const updated = await this.userService.updatePassword(tokenModel.userId, tokenModel.newPassword);
    await this.emailService.resetPasswordSuccess(updated);
    await this.destroyPreviousResetToken(tokenModel.userId);
  }

  public async resetPasswordMobileVerify(req, payload: VerifyMobilePhonePayload): Promise<void> {
    const tokenModel = await this.findBySmsCodeResetPass(payload.smsCode);
    const verifiedToken = await this.verifyResetToken(tokenModel.emailToken);
    const updated = await this.userService.updatePassword(tokenModel.userId, tokenModel.newPassword);
    await this.emailService.resetPasswordSuccess(updated);
  }

  public async findBySmsCodeResetPass(smsCode: number): Promise<ResetPassword> {
    const resetPass = await this.resetPassModel.findOne({
      mobileSmsCode: smsCode,
      mobileSmsCodeExpires: {$gt: new Date()},
    });
    if (!resetPass) {
      throw new BadRequestException('Reset Pass bad request.');
    }
    return resetPass;
  }

  private setMobileVerificationCode(user: UserDocument): UserDocument {
    user.mobilePhoneVerificationCode = create6DigitsCode();
    user.mobilePhoneVerificationExpires = addMinutes(new Date(), this.MINUTES_TO_VERIFY_MOBILE_PHONE);
    return user;
  }

  private setEmailConfirmationCode(user): UserDocument {
    user.emailConfirmationCode = this.encryptText(user.email);
    user.emailConfirmationExpires = addHours(new Date(), this.HOURS_TO_VERIFY_EMAIL_ADDRESS);
    return user;
  }

  private createEmailResetToken(userId: string) {
    const secret = this.configService.get('JWT_SECRET_KEY');
    const expiresIn = this.HOURS_TO_VERIFY_EMAIL_ADDRESS + 'h';
    return sign({data: userId}, secret, {expiresIn});
  }

  private createSignToken(userId: number): string {
    return this.jwtService.sign({sub: userId});
  }

  private encryptText(text: string): string {
    const cryptr = new Cryptr(this.configService.get('JWT_SECRET_TOKEN'));
    return cryptr.encrypt(text);
  }

  async verifyPayload(payload: JwtPayload): Promise<IUser> {
    let user: IUser;
    try {
      user = await this.userService.findById(payload.sub);
    } catch (error) {
      throw new UnauthorizedException(`There isn't any user: ${payload.sub}`);
    }
    delete user.password;
    return user;
  }

  async confirmResetPassThroughEmail(userId: string) {
    const user = await this.userService.findById(userId);
    return await this.userService.setUsersEmailConfirmed(user);
  }

  public async logout(user) {
    await this.userService.updateStatus(user._id, UserStatusEnum.disabled);
    await this.blackListJWTToken(user._id);
    return ['Authentication=; HttpOnly; Path=/; Max-Age=0', 'Refresh=; HttpOnly; Path=/; Max-Age=0'];
  }

  // async refreshAccessToken(refreshAccessTokenDto: RefreshAccessTokenPayload) {
  //   const refreshToken = await this.findRefreshToken(
  //     refreshAccessTokenDto.refreshToken,
  //   );
  //   const user = await this.userService.findById(refreshToken._id);
  //   if (!user) {
  //     throw new BadRequestException('Bad request');
  //   }
  //   return {
  //     accessToken: await this.createResetToken(user._id),
  //   };
  // }
  //
  // async createRefreshToken(req: Request, userId) {
  //   const refreshToken = new this.refreshTokenModel({
  //     userId,
  //     refreshToken: this.encryptText(userId),
  //     ip: this.getIp(req),
  //     browser: this.getBrowserInfo(req),
  //     country: this.getCountry(req),
  //   });
  //   await refreshToken.save();
  //   return refreshToken.refreshToken;
  // }
  //
  // async findRefreshToken(token: string) {
  //   const refreshToken = await this.refreshTokenModel.findOne({
  //     refreshToken: token,
  //   });
  //   if (!refreshToken) {
  //     throw new UnauthorizedException('User has been logged out.');
  //   }
  //   return refreshToken.userId;
  // }

  // async forgotPasswordByEmail(
  //   req: Request,
  //   createForgotPasswordDto: CreateForgotPasswordPayload,
  // ) {
  //   await this.userService.findUserByEmail(createForgotPasswordDto.email);
  //   await this.saveForgotPassword(req, createForgotPasswordDto);
  //   return {
  //     email: createForgotPasswordDto.email,
  //     message: 'verification sent.',
  //   };
  // }
  //
  // async forgotPasswordByEmailVerify(
  //   req: Request,
  //   verifyUuidDto: ConfirmEmailPayload,
  // ) {
  //   const forgotPassword = await this.findForgotPasswordByUuid(verifyUuidDto);
  //   await this.setForgotPasswordFirstUsed(req, forgotPassword);
  //   return {
  //     email: forgotPassword.email,
  //     message: 'now reset your password.',
  //   };
  // }

  private async initResetToken(userId: string, newPassword: string): Promise<ResetPassword> {
    const resetPass = new this.resetPassModel({});
    resetPass.newPassword = newPassword;
    resetPass.userId = userId;
    const emailJwtToken = this.createEmailResetToken(userId);
    resetPass.emailToken = emailJwtToken;
    resetPass.mobileSmsCode = create6DigitsCode();
    resetPass.mobileSmsCodeExpires = addMinutes(new Date(), this.MINUTES_TO_VERIFY_MOBILE_PHONE);
    return await resetPass.save();
  }

  private async destroyPreviousResetToken(userId: string) {
    const resetPass = await this.resetPassModel.findOne({userId}).exec();
    if (resetPass) {
      await resetPass.deleteOne();
    }
  }

  private async verifyResetToken(token: string): Promise<ResetPassword> {
    const resetPass = await this.resetPassModel.findOne({emailToken: token}).exec();
    if (!resetPass) {
      throw new Error('Invalid or expired password reset token');
    }
    const done = this.jwtService.verify(token, this.configService.get('JWT_SECRET_KEY'));
    resetPass.emailToken = null;
    return resetPass.save();
  }

  // private async setForgotPasswordFirstUsed(
  //   req: Request,
  //   forgotPassword: ForgotPassword,
  // ) {
  //   forgotPassword.firstUsed = true;
  //   forgotPassword.ipChanged = this.getIp(req);
  //   forgotPassword.browserChanged = this.getBrowserInfo(req);
  //   forgotPassword.countryChanged = this.getCountry(req);
  //   await forgotPassword.save();
  // }

  public async blockUser(user) {
    user.blockExpires = addHours(new Date(), this.HOURS_TO_BLOCK);
    await user.save();
  }

  private isUserBlocked(user): ForbiddenException | void {
    if (user.blockExpires > Date.now()) {
      throw new ForbiddenException({expiration: user.blockExpires}, `User has been blocked try later after`);
    }
  }

  private async checkPassword(attemptPass: string, user) {
    this.isUserBlocked(user);
    const match = await comparePass(attemptPass, user.password);
    if (!match) {
      await this.countLoginAttempts(user);
      throw new NotFoundException({
        status: HttpStatus.FORBIDDEN,
        error: 'Wrong password. The account will be blocked.',
        usedAttempts: user.loginAttempts,
        leftAttempts: this.LOGIN_ATTEMPTS_TO_BLOCK - user.loginAttempts,
      });
    }
    await this.resetLoginAttempts(user);
    return match;
  }

  public passwordAndConfirmMatch(pass: string, confirmPass: string) {
    if (pass !== confirmPass) {
      throw new BadRequestException('Password and confirm password does not match');
    }
  }

  public passwordAndNewMatch(pass: string, newPass: string) {
    if (pass === newPass) {
      throw new BadRequestException('Password and new Password match');
    }
  }

  private async countLoginAttempts(user) {
    user.loginAttempts += 1;
    await user.save();
    if (user.loginAttempts >= this.LOGIN_ATTEMPTS_TO_BLOCK) {
      await this.blockUser(user);
      throw new ConflictException('User blocked.');
    }
  }

  private async resetLoginAttempts(user) {
    user.loginAttempts = 0;
    await user.save();
  }

  getIp(req: Request): string {
    return getClientIp(req);
  }

  getBrowserInfo(req: Request): string {
    return req.headers['user-agent'] || 'XX';
  }

  getCountry(req: Request): any {
    return 'XX';
  }
}
