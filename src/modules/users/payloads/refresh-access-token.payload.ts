import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class RefreshAccessTokenPayload {
  @ApiModelProperty({
    description: 'uuid for refresh token',
    format: 'uuid',
    uniqueItems: true,
  })
  @IsNotEmpty()
  @IsUUID()
  readonly refreshToken: string;
}
