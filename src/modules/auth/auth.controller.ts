import {Body, Controller, Get, Headers, HttpCode, HttpStatus, Post, Query, Req, Res, UseGuards} from '@nestjs/common';
import {ApiBearerAuth, ApiCookieAuth, ApiOkResponse, ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger';
import {Request, Response} from 'express';
import {LoginWithEmailPayload, LoginWithPhonePayload} from '../users/payloads/login.payloads';
import {ConfirmEmailPayload} from '../users/payloads/confirm-email.payload';
import {VerifyMobilePhonePayload} from '../users/payloads/verify-phone.payload';
import {ResetPasswordPayload} from '../users/payloads/reset-password.payload';
import {AuthService} from './auth.service';
import {
  RegisterPayload,
  EmailConfirmationPayload,
  MobileVerificationPayload,
} from '../users/payloads/register.payloads';
import {JwtAuthGuard} from './guards/jwt-auth.guard';
import {LocalAuthGuard} from './guards/local-auth.guard';
import {PHONE_LOCAL_STRATEGY_FIELD} from './strategies/local.strategy';
import {AuthUser} from '../users/user.decorator';
import {IUser} from '../users/interfaces/user.interface';
import {SessionAuthGuard} from './guards/session.guard';
import {RolesGuard} from './guards/roles.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({status: 200, description: 'Patch Profile Request Received'})
  @ApiOperation({description: 'New user account registration'})
  @ApiOkResponse({})
  async register(@Res() res: Response, @Body() payload: RegisterPayload): Promise<any> {
    const user = await this.authService.register(payload);
    const messages = [];
    if (!user.mobilePhoneVerified && user.mobilePhoneVerificationExpires) {
      messages.push('Verify mobile number through sms');
    }
    if (!user.emailConfirmed && user.emailConfirmationExpires) {
      messages.push('Check email and confirm email address');
    }
    res.send({
      statusCode: HttpStatus.CREATED,
      messages,
    });
  }

  @Post('mobile/verification')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({description: 'Verify mobile phone'})
  @ApiOkResponse({description: 'Mobile phone number verification done'})
  async verifyMobile(
    @Req() req: Request,
    @Body() payload: VerifyMobilePhonePayload,
    @Res() res: Response,
    @Headers() headers: Headers,
  ) {
    await this.authService.verifyMobile(payload.smsCode);
    res.send({
      statusCode: HttpStatus.OK,
      message: 'Mobile verification process has been passed ok. Now you can login.',
    });
  }

  @Post('mobile/verification/resend')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({status: 200, description: 'Patch Profile Request Received'})
  @ApiOperation({description: 'Register user'})
  @ApiOkResponse({})
  async resendMobileCode(@Res() res, @Body() payload: MobileVerificationPayload): Promise<any> {
    await this.authService.sendMobileVerificationCode(payload);
    res.send({
      statusCode: HttpStatus.CREATED,
      message: 'Verify mobile number through sms',
      error: null,
    });
  }

  @Post('mobile/login')
  // @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({description: 'Mobile sign in to user account'})
  async loginMobile(
    @Req() req: Request,
    @Res() res: Response,
    @Headers() headers: Headers,
    @Body() payload: LoginWithPhonePayload,
  ) {
    const token = await this.authService.loginWithPhone(payload[PHONE_LOCAL_STRATEGY_FIELD]);
    res.header('Authorization', `Bearer ${token}`);
    res.cookie('token', token, {
      httpOnly: true,
      signed: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });
    res.send({
      accessToken: token,
    });
    return res;
  }

  // @Post('email/login')
  // @UseGuards(LocalAuthGuard)
  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({description: 'Email sign in to user account'})
  // async loginEmail(
  //   @Req() req: Request,
  //   @Res() res: Response,
  //   @Headers() headers: Headers,
  //   @Body() payload: LoginWithEmailPayload,
  // ) {
  //   const token = await this.authService.loginWithEmail(payload);
  //   res.header('Authorization', `Bearer ${token}`);
  //   res.cookie('token', token, {
  //     httpOnly: true,
  //     signed: true,
  //     sameSite: 'strict',
  //     secure: process.env.NODE_ENV === 'production',
  //   });
  //   res.send({
  //     accessToken: token,
  //   });
  //   return res;
  // }

  // @Get('email/confirm/:code')
  // @ApiParam({ name: 'code', type: String, description: 'confirmation code' }
  @Get('email/confirm')
  @ApiOperation({description: 'Confirm email address'})
  async confirmEmail(@Req() req: Request, @Res() res: Response, @Query() query: ConfirmEmailPayload) {
    await this.authService.confirmEmail(query.code);
    res.send({emailConfirmed: 'Ok'});
  }

  @Post('email/confirm/resend')
  @ApiOperation({description: 'Resend email address confirmation'})
  async sendEmailConfirmation(@Req() req: Request, @Res() res: Response, @Body() payload: EmailConfirmationPayload) {
    const user = await this.authService.sendEmailConfirmation(payload);
    res.send({
      statusCode: HttpStatus.CREATED,
      message: 'Verify mobile number through sms',
      error: null,
    });
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({description: 'Request password reset'})
  async resetPasswordRequest(@Body() payload: ResetPasswordPayload) {
    return await this.authService.resetPasswordRequest(payload);
  }

  @Get('reset-password/email/confirm')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({description: 'Confirmation reset password through email'})
  @ApiOkResponse({description: 'Confirmation password through email done'})
  async resetPasswordEmailConfirm(
    @Req() req: Request,
    @Query() query: {token: string},
    @Res() res: Response,
    @Headers() headers: Headers,
  ) {
    const done = await this.authService.resetPasswordEmailConfirm(query);
    res.send({mobileVerified: 'Ok'});
  }

  @Post('reset-password/mobile/verification')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({description: 'Verification reset password through mobile'})
  @ApiOkResponse({description: 'Verification password through mobile done'})
  async resetPasswordMobileVerify(
    @Req() req: Request,
    @Body() payload: VerifyMobilePhonePayload,
    @Res() res: Response,
    @Headers() headers: Headers,
  ) {
    const done2 = await this.authService.resetPasswordMobileVerify(req, payload);
    res.send({mobileVerified: 'Ok'});
  }

  @Get('logout')
  @UseGuards(JwtAuthGuard, SessionAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiCookieAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({description: 'Sign out from user account'})
  async logout(@AuthUser() user: IUser, @Req() req, @Res() res, @Headers() headers: Headers) {
    const cookies = this.authService.logout(user);
    req.session.destroy(() => {
      req.res.setHeader('Set-Cookie', cookies);
      req.logOut();
      return res.redirect('/');
    });
  }

  // @Post('refresh-access-token')
  // @HttpCode(HttpStatus.CREATED)
  // @ApiOperation({ description: 'Refresh Access Token with refresh token' })
  // @ApiCreatedResponse({})
  // async refreshAccessToken(
  //   @Body() refreshAccessTokenDto: RefreshAccessTokenPayload,
  // ) {
  //   return await this.authService.refreshAccessToken(refreshAccessTokenDto);
  // }

  // @Post('forgot-password')
  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({ description: 'Forgot password' })
  // @ApiOkResponse({})
  // async forgotPassword(
  //   @Req() req: Request,
  //   @Body() createForgotPasswordDto: CreateForgotPasswordPayload,
  // ) {
  //   return await this.authService.forgotPasswordByEmail(
  //     req,
  //     createForgotPasswordDto,
  //   );
  // }

  // @Post('forgot-password-verify')
  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({ description: 'Verify forget password code' })
  // @ApiOkResponse({})
  // async forgotPasswordVerify(
  //   @Req() req: Request,
  //   @Body() payload: ConfirmEmailPayload,
  // ) {
  //   return await this.authService.forgotPasswordByEmailVerify(req, payload);
  // }
}
