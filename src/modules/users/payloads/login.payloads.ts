import {IsNotEmpty, MinLength, MaxLength, IsEmail, IsString, IsMobilePhone, Matches} from 'class-validator';
import {ApiModelProperty} from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import {ApiProperty} from '@nestjs/swagger';

// ^	The password string will start this way
// (?=.*[a-z])	The string must contain at least 1 lowercase alphabetical character
// (?=.*[A-Z])	The string must contain at least 1 uppercase alphabetical character
// (?=.*[0-9])	The string must contain at least 1 numeric character
// (?=.*[!@#$%^&*])	The string must contain at least one special character, but we are escaping reserved RegEx characters to avoid conflict
// (?=.{8,})	The string must be eight characters or longer

export const strongRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})');
export const mediumRegex = new RegExp(
  '^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})',
);

export class LoginWithEmailPayload {
  @ApiModelProperty({
    example: 'test1@gmail.com',
    description: 'The email of the User',
    format: 'email',
    uniqueItems: true,
    minLength: 5,
    maxLength: 255,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(255)
  @IsEmail()
  readonly email: string;
}

export class LoginWithPhonePayload {
  @ApiProperty({required: true})
  @ApiModelProperty({
    example: '+972546556585',
    description: 'The mobile of the User',
    format: 'mobile',
  })
  @IsNotEmpty()
  @IsMobilePhone()
  @IsString()
  mobilePhone: string;
}
