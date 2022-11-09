import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class ConfirmEmailPayload {
  @ApiProperty()
  @ApiModelProperty({
    description: 'code to verify user through email',
  })
  @IsNotEmpty()
  readonly code: string;
}
