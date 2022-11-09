import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import isEmail from 'validator/lib/isEmail';
import isUUID from 'validator/lib/isUUID';
import isMobilePhone from 'validator/lib/isMobilePhone';
import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {CommonSchemaOptions} from '../../../helpers/common-schema.options';
import {Document} from 'mongoose';
import {IUser} from '../interfaces/user.interface';
import {UserRoleEnum} from '../../../enums/user-role.enum';
import {Exclude} from 'class-transformer';
import {UserStatusEnum} from '../../../enums/user-status.enum';
import {Project, ProjectsSchema} from '../../projects/projects.schema';
import {ModelEnum} from '../../../enums/model.enum';
import {AwsFile} from '../../files/aws-file.schema';
import {hashPassword} from '../../../helpers/password-hash';

export type UserDocument = User & Document;

@Schema({
  ...CommonSchemaOptions,
  toObject: {
    transform: (doc, ret) => {
      delete ret?.password;
      delete ret?.mobilePhoneVerificationCode;
      delete ret?.mobilePhoneVerificationExpires;
      delete ret?.emailConfirmationCode;
      delete ret?.emailConfirmationExpires;
      delete ret?.blockExpires;
    },
  },
  toJSON: {
    transform: (doc, ret) => {
      delete ret?.password;
      delete ret?.mobilePhoneVerificationCode;
      delete ret?.mobilePhoneVerificationExpires;
      delete ret?.emailConfirmationCode;
      delete ret?.emailConfirmationExpires;
      delete ret?.blockExpires;
    },
  },
})
export class User implements IUser {
  @Prop({
    type: String,
    minlength: 2,
  })
  firstName: string;

  @Prop({
    type: String,
    minlength: 2,
  })
  lastName: string;

  @Prop({
    type: String,
    lowercase: true,
    validate: isEmail,
    maxlength: 255,
    minlength: 6,
    unique: true,
    required: [false, 'EMAIL_IS_BLANK'],
  })
  email: string;

  @Prop({
    type: String,
    lowercase: true,
    unique: true,
    validate: isMobilePhone,
    required: [true, 'MOBILE_PHONE_IS_BLANK'],
  })
  mobilePhone: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  emailConfirmed: boolean;

  @Prop({
    type: Boolean,
    default: false,
  })
  mobilePhoneVerified: boolean;

  @Prop({
    type: String,
    required: [false, 'EMAIL_CONFIRMATION_CODE_IS_BLANK'],
  })
  emailConfirmationCode: string;

  @Prop({
    type: Date,
  })
  emailConfirmationExpires: Date;

  @Prop({
    type: Number,
    required: [true, 'MOBILE_PHONE_VERIFICATION_CODE_IS_BLANK'],
  })
  mobilePhoneVerificationCode: number;

  @Prop({
    type: Date,
  })
  mobilePhoneVerificationExpires: Date;

  @Prop({
    type: String,
    minlength: 5,
    maxlength: 1024,
  })
  @Exclude()
  password: string;

  @Prop({
    type: String,
    default: UserRoleEnum.User,
    enum: Object.values(UserRoleEnum),
  })
  role: UserRoleEnum;

  @Prop({
    type: Number,
    default: 0,
  })
  loginAttempts: number;

  @Prop({
    type: Date,
    default: Date.now,
  })
  blockExpires: Date;

  @Prop({
    type: String,
    enum: Object.values(UserStatusEnum),
    default: UserStatusEnum.disabled,
  })
  status: UserStatusEnum;

  @Prop({
    type: String,
    default: '',
  })
  country: string;

  @Prop({
    type: String,
  })
  address: string;

  @Prop({
    type: Number,
  })
  companyID: number;

  @Prop({
    type: String,
    default: '',
  })
  notificationId: string;

  @Prop({
    type: String,
    default: '',
  })
  device: string;

  @Prop({type: Date, default: Date.now})
  lastSeenAt: Date;

  @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: ModelEnum.Projects}]})
  projects: Project[];

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: ModelEnum.Files})
  avatar: AwsFile;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next: mongoose.HookNextFunction) {
  try {
    if (!this.isModified('password')) {
      return next();
    }
    // tslint:disable-next-line:no-string-literal
    const hashed = hashPassword(this['password']);
    // tslint:disable-next-line:no-string-literal
    this['password'] = hashed;
    next();
  } catch (err) {
    next(err);
  }
});

UserSchema.post('remove', async (doc) => {
  console.log('removing user hook', doc);
  // throw new Error('something went wrong');
  // remove projects
  // remove avatar
});
