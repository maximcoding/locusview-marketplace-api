import {
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsEmail,
  IsString,
  Matches,
  IsMobilePhone,
  IsOptional,
  IsObject,
} from 'class-validator';
import {ApiModelProperty} from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import {ApiProperty} from '@nestjs/swagger';
import {mediumRegex} from './login.payloads';
import {Exclude} from 'class-transformer';

class FulNamePayload {
  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Z ]+$/)
  @MinLength(2)
  @MaxLength(255)
  firstName: string;

  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Z ]+$/)
  @MinLength(2)
  @MaxLength(255)
  lastName: string;
}

export class RegisterPayload {
  @ApiProperty({required: true, minimum: 8, maximum: 1024})
  @ApiModelProperty({
    example: 'test123123',
    description: 'The password of the User',
    format: 'string',
    minLength: 8,
    maxLength: 1024,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @Matches(mediumRegex)
  @MinLength(8)
  @MaxLength(1024)
  password: string;

  @ApiProperty({required: true, minimum: 8, maximum: 1024})
  @ApiModelProperty({
    example: 'test123123',
    description: 'The password of the User',
    format: 'string',
    minLength: 8,
    maxLength: 1024,
    required: true,
  })
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(1024)
  confirmPassword: string;

  @ApiModelProperty({
    example: 'john',
    description: 'The first name',
    format: 'string',
  })
  @IsOptional()
  @ApiProperty({required: false})
  @IsString()
  @IsOptional()
  @Matches(/^[a-zA-Z ]+$/)
  @MinLength(2)
  @MaxLength(50)
  firstName: string;

  @IsOptional()
  @ApiModelProperty({
    example: 'johnson',
    description: 'The last name',
    format: 'string',
  })
  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Z ]+$/)
  @MinLength(2)
  @MaxLength(50)
  lastName: string;

  // Email
  @ApiProperty({required: false})
  @ApiModelProperty({
    example: 'test1@gmail.com',
    description: 'The email of the User',
    format: 'email',
  })
  @IsEmail()
  @IsOptional()
  readonly email: string;

  @ApiProperty({required: true})
  @ApiModelProperty({
    example: '+972546556585',
    description: 'Mobile phone number of the User',
    format: 'mobile',
  })
  @IsNotEmpty()
  @IsMobilePhone()
  @IsString()
  mobilePhone: string;
}

export class MobileVerificationPayload {
  @ApiProperty({required: true})
  @ApiModelProperty({
    example: '+972546556585',
    description: 'Mobile phone number of the User',
    format: 'mobile',
  })
  @IsNotEmpty()
  @IsMobilePhone()
  mobilePhone: string;
}

export class EmailConfirmationPayload {
  @ApiProperty({required: true})
  @ApiModelProperty({
    example: 'test1@gmail.com',
    description: 'The email of the User',
    format: 'email',
  })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
}
