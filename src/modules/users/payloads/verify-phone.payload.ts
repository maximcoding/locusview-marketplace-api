import {IsNotEmpty, IsNumber, IsString} from 'class-validator';
import {ApiModelProperty} from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import {ApiProperty} from '@nestjs/swagger';

export class VerifyMobilePhonePayload {
  @ApiProperty()
  @ApiModelProperty({
    description: 'SMS 6 digits to verify user through mobile phone',
  })
  @IsNotEmpty()
  @IsNumber()
  readonly smsCode: number;
}
