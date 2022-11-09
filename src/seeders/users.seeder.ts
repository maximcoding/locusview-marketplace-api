import {Inject, Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {Seeder, DataFactory} from 'nestjs-seeder';
import {User} from '../modules/users/schemas/user.schema';
import {UserStatusEnum} from '../enums/user-status.enum';
import {IUser} from '../modules/users/interfaces/user.interface';
import {hashPassword} from '../helpers/password-hash';
import {UserRoleEnum} from '../enums/user-role.enum';

const userData: IUser = {
  email: 'maxim.livshitz@locusview.com',
  mobilePhone: '+972546556585',
  password: hashPassword('pass123123'),
  role: UserRoleEnum.Admin,
  name: {
    first: 'Maxim',
    last: 'L',
  },
  firstName: 'Maxim',
  lastName: 'Coding',
  emailConfirmed: true,
  emailConfirmationCode: '123456',
  emailConfirmationExpires: new Date(),
  mobilePhoneVerified: true,
  mobilePhoneVerificationCode: 123456,
  mobilePhoneVerificationExpires: new Date(),
  status: UserStatusEnum.active,
  country: 'IL',
  address: 'Levi Eshkol 2, Netanya',
  device: 'IOS',
  lastSeenAt: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
};

@Injectable()
export class UsersSeeder implements Seeder {
  constructor(@InjectModel(User.name) private readonly dataModel: Model<User>) {}

  seed(): Promise<any> {
    return this.dataModel.insertMany(userData);
  }

  drop(): Promise<any> {
    return this.dataModel.deleteMany({}) as any;
  }
}
