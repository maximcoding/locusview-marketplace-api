import {forwardRef, Module} from '@nestjs/common';
import {UserController} from './controllers/user.controller';
import {UserService} from './services/user.service';
import {usersProviders} from './user.provider';
import {DatabaseModule} from '../database';
import {AuthModule} from '../auth/auth.module';
import {EmailModule} from '../email/email.module';
import {SmsModule} from '../sms/sms.module';
import {FilesModule} from '../files/files.module';

@Module({
    imports: [FilesModule, EmailModule, SmsModule, DatabaseModule, forwardRef(() => AuthModule)],
    controllers: [UserController],
    providers: [UserService, ...usersProviders],
    exports: [UserService],
})
export class UserModule {
}
