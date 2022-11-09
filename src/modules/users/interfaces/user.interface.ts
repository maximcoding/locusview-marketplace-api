import {UserRoleEnum} from '../../../enums/user-role.enum';
import {UserStatusEnum} from '../../../enums/user-status.enum';
import {Prop} from '@nestjs/mongoose';
import {IAwsFile} from '../../files/aws-file.schema';

export interface IUser {
  _id?: string;
  name?: {
    first: string;
    last: string;
  };
  firstName?: string;
  lastName?: string;
  email: string;
  emailConfirmed: boolean;
  emailConfirmationCode: string;
  emailConfirmationExpires: Date;
  mobilePhone: string;
  mobilePhoneVerified: boolean;
  mobilePhoneVerificationCode: number;
  mobilePhoneVerificationExpires: Date;
  password: string;
  role: string;
  loginAttempts?: number;
  blockExpires?: Date;
  status?: UserStatusEnum;
  country?: string;
  address?: string;
  companyID?: number;
  currency?: string;
  notificationId?: string;
  device?: string;
  lastSeenAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
