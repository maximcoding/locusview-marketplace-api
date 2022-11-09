import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ComplainPayload {
  @ApiProperty()
  @IsString()
  from: string;

  @ApiProperty()
  @IsString()
  text: string;

  @ApiProperty()
  @IsString()
  userId: string;
}
