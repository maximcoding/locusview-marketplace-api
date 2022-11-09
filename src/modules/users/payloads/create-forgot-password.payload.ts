import {
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsEmail,
  IsString,
} from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class CreateForgotPasswordPayload {
  @ApiModelProperty({
    example: 'pejman@gmail.com',
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
