import {CompanyEnum} from '../../../enums/companyEnum';
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
import {IProject} from "../projects.schema";
import {IAwsFile} from 'src/modules/files/aws-file.schema';

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

export class CreateProjectPayload implements IProject {
    @ApiProperty({
        description: 'company name ( project type ) mandatory',
        enum: CompanyEnum,
        enumName: 'CompanyEnum',
        default: CompanyEnum.OneGas,
        required: true,
    })
    @IsEnum(CompanyEnum)
    @IsString()
    @IsNotEmpty()
    projectType: CompanyEnum;

    @ApiProperty({description: faker.lorem.words(), default: faker.lorem.words(), required: false, type: String})
    @IsString()
    location: string;

    @ApiProperty({type: [String]})
    @IsArray()
    contractor: string[];

    @ApiProperty({type: [String]})
    @IsArray()
    requiredQualifications: string[];

    @ApiProperty({description: 'start date'})
    @IsDateString()
    startDate: Date;

    @ApiProperty({description: 'due date'})
    @IsDateString()
    dueDate: Date;

    @ApiProperty({description: faker.lorem.words(), default: faker.lorem.words(), required: false, type: String})
    title: string;

    @ApiProperty({description: faker.lorem.words(), default: faker.lorem.words(), required: false, type: String})
    @MinLength(2)
    @IsOptional()
    @IsString()
    description: string;

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
