import {
  Controller,
  Get,
  UseGuards,
  Param,
  Query,
  Delete,
  Post,
  UseInterceptors,
  Req,
  UploadedFile,
} from '@nestjs/common';
import {UserService} from '../services/user.service';
import {ApiOperation, ApiTags, ApiResponse, ApiParam, ApiBearerAuth, ApiCookieAuth, ApiConsumes} from '@nestjs/swagger';
import {ModelEnum} from '../../../enums/model.enum';
import {IUser} from '../interfaces/user.interface';
import {AuthUser} from '../user.decorator';
import {ApiImplicitParam} from '@nestjs/swagger/dist/decorators/api-implicit-param.decorator';
import {ObjectIdValidationPipe} from '../../../helpers/object-id.validation.pipe';
import {Roles} from '../../auth/decorators/roles.decorator';
import {UserRoleEnum} from '../../../enums/user-role.enum';
import {FileInterceptor} from '@nestjs/platform-express';
import {JwtAuthGuard} from '../../auth/guards/jwt-auth.guard';
import {ApiAvatarFile} from '../../files/api-file.decorator';
import {UserDocument} from '../schemas/user.schema';
import {RolesGuard} from '../../auth/guards/roles.guard';

@ApiTags('Users')
@Controller(ModelEnum.Users)
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@ApiCookieAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('all')
  @Roles(UserRoleEnum.Admin)
  @ApiResponse({status: 400, description: 'Bad Request'})
  @ApiResponse({status: 401, description: 'Unauthorized'})
  @ApiOperation({description: 'Find all users'})
  async findAll(@Query() query): Promise<IUser[]> {
    return await this.userService.findAll();
  }

  @Get(':id')
  @ApiParam({name: 'id', description: 'User id'})
  @ApiOperation({description: 'Find user by id'})
  async findOne(@Param('id', ObjectIdValidationPipe) id: string): Promise<IUser> {
    return await this.userService.findById(id);
  }

  @Post('me')
  me(@AuthUser() user: IUser): IUser {
    return user;
  }

  @Get('role')
  @ApiResponse({status: 400, description: 'Bad Request'})
  @ApiResponse({status: 401, description: 'Unauthorized'})
  async findByRoleName(@Query() query): Promise<IUser[]> {
    return await this.userService.findByRoleName(query.role);
  }

  @Delete('all')
  async delete(): Promise<void> {
    await this.userService.removeAll();
  }

  @Delete(':id')
  async deleteOne(@Param('id', ObjectIdValidationPipe) id: string): Promise<void> {
    await this.userService.deleteById(id);
  }

  @Post('upload/multipart/avatar')
  @ApiConsumes('multipart/form-data')
  @ApiAvatarFile()
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@AuthUser() user: UserDocument, @UploadedFile('file') file: Express.Multer.File) {
    return this.userService.addAvatar(user, file);
  }

  @Post('avatar/delete')
  @ApiConsumes('multipart/form-data')
  @ApiAvatarFile()
  @UseInterceptors(FileInterceptor('file'))
  deleteFile(@AuthUser() user: IUser) {
    return this.userService.deleteAvatar(user._id);
  }
}
