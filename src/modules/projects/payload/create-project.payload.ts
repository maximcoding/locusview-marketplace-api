import {ProjectTypeEnum} from '../../../enums/projectTypeEnum';
import {
    IsArray,
    IsDateString,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    MinLength,
} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';
import * as faker from 'faker';

export const currencyOptions = {
    require_symbol: false,
    allow_space_after_symbol: false,
    symbol_after_digits: false,
    allow_negatives: false,
    parens_for_negatives: false,
    negative_sign_before_digits: false,
    negative_sign_after_digits: false,
    allow_negative_sign_placeholder: false,
    thousands_separator: '.',
    decimal_separator: '.',
    allow_decimal: true,
    require_decimal: false,
    digits_after_decimal: [2],
    allow_space_after_digits: false,
};

export class CreateProjectPayload {
    @ApiProperty({
        description: 'project type mandatory',
        enum: ProjectTypeEnum,
        enumName: 'ProjectTypeEnum',
        default: ProjectTypeEnum.OneGas,
        required: true,
    })
    @IsEnum(ProjectTypeEnum)
    @IsString()
    @IsNotEmpty()
    projectType: ProjectTypeEnum;

    @ApiProperty({type: [Number]})
    @IsArray()
    location: number[];

    @ApiProperty({description: 'start date'})
    @IsDateString()
    startDate: Date;

    @ApiProperty({description: 'end date'})
    @IsDateString()
    endDate: Date;

    @ApiProperty({description: faker.lorem.words(), default: faker.lorem.words(), required: false, type: String})
    title: string;

    @ApiProperty({description: faker.lorem.words(), default: faker.lorem.words(), required: false, type: String})
    @MinLength(2)
    @IsOptional()
    @IsString()
    description: string;

    @ApiProperty({description: faker.name.firstName(), default: faker.name.firstName(), required: false, type: String})
    @MinLength(2)
    @IsOptional()
    @IsString()
    contractor: string;

    @ApiProperty({description: faker.lorem.words(), default: faker.lorem.words(), required: false, type: String})
    @MinLength(2)
    @IsOptional()
    @IsString()
    companyName: string;

    @ApiProperty({description: faker.lorem.words(), default: faker.lorem.words(), required: false, type: String})
    @MinLength(2)
    @IsOptional()
    @IsString()
    projectName: string;

}
