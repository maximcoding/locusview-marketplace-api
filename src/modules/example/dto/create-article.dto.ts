import {
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsEmail,
  IsString,
} from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class CreateArticleDto {
  @ApiModelProperty({
    example: 'Example Title',
    description: 'Title of example',
    format: 'string',
    minLength: 6,
    maxLength: 255,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(255)
  readonly title: string;

  @ApiModelProperty({
    example: 'Body exmaple ...',
    description: 'Main part of example',
    format: 'string',
  })
  @IsNotEmpty()
  @IsString()
  readonly body: string;
}
