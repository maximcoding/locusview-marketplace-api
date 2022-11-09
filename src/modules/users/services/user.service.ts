import {AuthService} from '../../auth/auth.service';
import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  HttpStatus,
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {Model} from 'mongoose';
import {RegisterPayload} from '../payloads/register.payloads';
import {User, UserDocument} from '../schemas/user.schema';
import crypto from 'crypto';
import {UserRoleEnum} from '../../../enums/user-role.enum';
import {ResetPasswordPayload} from '../payloads/reset-password.payload';
import {IUser} from '../interfaces/user.interface';
import {UserStatusEnum} from '../../../enums/user-status.enum';
import {PHONE_LOCAL_STRATEGY_FIELD} from '../../auth/strategies/local.strategy';
import {FilesService} from '../../files/files.service';
import {AppFileEnum, IAwsFile, ImageFormat} from '../../files/aws-file.schema';
import {ModelEnum} from '../../../enums/model.enum';

const path = require('path');

@Injectable()
export class UserService {
  constructor(
    private readonly filesService: FilesService,
    @Inject(ModelEnum.Users) public readonly userModel: Model<UserDocument>,
    @Inject(forwardRef(() => AuthService))
    public readonly authService: AuthService,
  ) {}

  public async create(payload: RegisterPayload): Promise<UserDocument> {
    // await this.userModel.deleteMany().exec();
    const user = await this.userModel
      .findOne({$or: [{mobilePhone: payload[PHONE_LOCAL_STRATEGY_FIELD]}, {email: payload.email}]})
      .exec();
    if (user) {
      throw new NotAcceptableException('Mobile Phone Number or Email Already Exist');
    }
    return new this.userModel(payload);
  }

  public async findAll(): Promise<UserDocument[]> {
    return this.userModel.find({}, this.projectionFields()).populate(AppFileEnum.avatar).sort({fullName: 1}).exec();
  }

  public async findById(id: string): Promise<UserDocument> {
    const found = this.userModel
      .findById(id)
      .populate('properties')
      .populate('visits')
      .populate(AppFileEnum.avatar)
      .exec();
    if (!found) {
      throw new NotFoundException('user not found');
    }
    return found;
  }

  public async findProperties(id: string): Promise<IUser> {
    return this.userModel.findById(id).populate('properties').exec();
  }

  public async findVisits(id: string): Promise<IUser> {
    return this.userModel.findById(id).populate('visits').exec();
  }

  public async findByRoleName(roleName: UserRoleEnum): Promise<IUser[]> {
    return this.userModel.find({role: roleName}).populate(AppFileEnum.avatar).exec();
  }

  public async updatePassword(userId: string, password: string): Promise<IUser> {
    return this.userModel.findOneAndUpdate({_id: userId}, {$set: {password}}, {new: true}).exec();
  }

  public async deleteById(id: string): Promise<void> {
    await this.userModel.findByIdAndDelete(id).exec();
  }

  public async findByEmailConfirmationCode(emailConfirmationCode: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({
      emailConfirmationCode: emailConfirmationCode.trim(),
      emailConfirmationExpires: {$gt: new Date()},
    });
    if (!user) {
      throw new NotFoundException();
    }
    if (user.emailConfirmed) {
      throw new ForbiddenException();
    }
    return user;
  }

  public async findByPhoneUnverified(mobilePhone: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({mobilePhone, mobilePhoneVerified: false}).exec();
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  public async findByEmailUnverified(mobilePhone: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({mobilePhone, emailConfirmed: false}).exec();
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  public async findByPhoneVerification(smsCode: number): Promise<UserDocument> {
    const user = await this.userModel.findOne({
      mobilePhoneVerificationCode: smsCode,
      mobilePhoneVerificationExpires: {$gt: new Date()},
      mobilePhoneVerified: false,
    });
    if (!user) {
      throw new BadRequestException();
    }
    return user;
  }

  public async findByEmail(email: string): Promise<IUser> {
    const user = await this.userModel.findOne({email, emailConfirmed: true});
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  public async setUsersEmailConfirmed(user: UserDocument): Promise<void> {
    user.emailConfirmed = true;
    user.status = UserStatusEnum.active;
    await user.save();
  }

  public async setUsersMobilePhoneVerified(user: UserDocument): Promise<void> {
    user.mobilePhoneVerified = true;
    user.status = UserStatusEnum.active;
    await user.save();
  }

  public async findVerifiedUserByPhone(mobilePhone: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({mobilePhone});
    if (!user) {
      throw new NotFoundException();
    }
    if (!user.mobilePhoneVerified) {
      throw new UnauthorizedException();
    }
    return user;
  }

  public async findVerifiedUserByEmail(email: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({email});
    if (!user) {
      throw new NotFoundException();
    }
    if (!user.emailConfirmed) {
      throw new UnauthorizedException(`Email address was not confirmed: ${user.email}`);
    }
    return user;
  }

  public async resetUserPassword(payload: ResetPasswordPayload): Promise<UserDocument> {
    const user = await this.userModel.findOne({
      password: payload.password,
      emailConfirmationExpires: {$gt: new Date()},
      mobilePhoneVerified: true,
    });
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  public async removeAll(): Promise<void> {
    await this.userModel.deleteMany().exec();
  }

  public async updateStatus(userId: string, status: UserStatusEnum) {
    return this.userModel.findOneAndUpdate({id: userId}, {$set: {status}}).exec();
  }

  // public async resetPassword(
  //   code,
  //   mobilePhone,
  //   oldPassword,
  //   newPassword,
  // ): Promise<IUser | undefined> {
  //   const user = await this.findOneByPhone(mobilePhone);
  //   if (user && user.passwordReset && user.status !== UserStatusEnum.active) {
  //     if (user.passwordReset.token === code) {
  //       user.password = oldPassword;
  //       user.passwordReset = undefined;
  //       await user.save();
  //       return user;
  //     }
  //   }
  //   return undefined;
  // }

  public async getByPhoneAndPass(mobilePhone: string, password: string): Promise<UserDocument> {
    return this.userModel
      .findOne({
        mobilePhone,
        password: crypto.createHmac('sha256', password).digest('hex'),
      })
      .exec();
  }

  public isAdmin(permissions: string[]): boolean {
    return permissions.includes('admin');
  }

  private projectionFields(): any {
    return {
      device: 0,
      loginAttempts: 0,
      mobilePhoneVerificationCode: 0,
      emailConfirmationCode: 0,
      emailConfirmationExpires: 0,
      mobilePhoneVerificationExpires: 0,
      emailConfirmed: 0,
      mobilePhoneVerified: 0,
    };
  }

  async addAvatar(user: UserDocument, file: Express.Multer.File): Promise<IUser> {
    const savedFile = await this.filesService.uploadPublicFile(file, AppFileEnum.avatar);
    user.avatar = savedFile._id;
    return await user.save();
  }

  async deleteAvatar(userId: string): Promise<any> {
    const user = await this.findById(userId);
    const file = user.avatar as IAwsFile;
    if (file) {
      await this.userModel.findByIdAndUpdate(userId, {...user, avatar: null});
      await this.filesService.deletePublicFile(file._id, file.fileType);
    }
  }

  // async addPermission(
  //   permission: string,
  //   username: string,
  // ): Promise<IUser | undefined> {
  //   const user = await this.findOneByUsername(username);
  //   if (!user) return undefined;
  //   if (user.permissions.includes(permission)) return user;
  //   user.permissions.push(permission);
  //   await user.save();
  //   return user;
  // }

  // async removePermission(
  //   permission: string,
  //   username: string,
  // ): Promise<IUser | undefined> {
  //   const user = await this.findOneByUsername(username);
  //   if (!user) return undefined;
  //   user.permissions = user.permissions.filter(
  //     (userPermission) => userPermission !== permission,
  //   );
  //   await user.save();
  //   return user;
  // }

  // public async forgotPassword(email: string): Promise<boolean> {
  //   if (!this.configService.emailEnabled) return false;
  //   const user = await this.findOneByEmail(email);
  //   if (!user) return false;
  //   if (!user.enabled) return false;
  //   const token = randomBytes(32).toString('hex');
  //   // One day for expiration of reset token
  //   const expiration = new Date(Date().valueOf() + 24 * 60 * 60 * 1000);
  //   const transporter = createTransport({
  //     service: this.configService.emailService,
  //     auth: {
  //       user: this.configService.emailUsername,
  //       pass: this.configService.emailPassword,
  //     },
  //   });
  //   const mailOptions: SendMailOptions = {
  //     from: this.configService.emailFrom,
  //     to: email,
  //     subject: `Reset Password`,
  //     text: `${user.username},
  //   Replace this with a website that can pass the token:
  //   ${token}`,
  //   };
  //   return new Promise((resolve) => {
  //     transporter.sendMail(mailOptions, (err, info) => {
  //       if (err) {
  //         resolve(false);
  //         return;
  //       }
  //
  //       user.passwordReset = {
  //         token,
  //         expiration,
  //       };
  //
  //       user.save().then(
  //         () => resolve(true),
  //         () => resolve(false),
  //       );
  //     });
  //   });
  // }
}
