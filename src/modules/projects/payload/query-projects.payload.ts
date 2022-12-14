import {
    ArrayUnique,
    IsArray,
    IsBoolean,
    IsBooleanString,
    IsCurrency,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    MinLength,
} from 'class-validator';
import {SortBy} from '../projects.service';
import {ApiProperty} from '@nestjs/swagger';
import {AppFileEnum} from '../../files/aws-file.schema';
import faker from 'faker';
import {currencyOptions} from './create-project.payload';
import {CompanyEnum} from "../../../enums/companyEnum";

export enum PropertyPreview {
    false,
    true,
}

export class QueryProjectsPayload {
    @ApiProperty({
        description: 'pagination',
        default: 1,
        required: false,
    })
    @IsOptional()
    @IsNotEmpty()
    page: number;

    @ApiProperty({
        description: 'pagination',
        default: 20,
        required: false,
    })
    @IsOptional()
    limit: number;

    @ApiProperty({
        description: 'any SortBy value',
        enum: SortBy,
        default: SortBy.new,
        enumName: 'SortBy',
    })
    @IsOptional()
    sort: SortBy;

}

export class QueryProjectsByTypePayload extends QueryProjectsPayload {
}

export class QueryProjectsByProjectTypePayload extends QueryProjectsPayload {
    @ApiProperty({
        description: 'project type mandatory',
        enum: CompanyEnum,
        enumName: 'ProjectTypeEnum',
        default: CompanyEnum.OneGas,
        required: true,
    })
    @IsEnum(CompanyEnum)
    @IsString()
    @IsNotEmpty()
    projectType: CompanyEnum;
}

export class QueryProjectsByAddressPayload extends QueryProjectsPayload {
    @ApiProperty({
        description: 'search by city',
        type: String,
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    address: string;
}

export class QueryProjectsByTextPayload extends QueryProjectsPayload {
    @ApiProperty({
        description: 'search by free text',
        required: false,
        type: String,
    })
    @MinLength(2)
    @IsOptional()
    @IsString()
    freeText: string;
}

export interface IFindAllProjectsResponse {
    projects: any[];
    total: number;
    page?: number;
    last_page?: number;
}

export class DeleteImagePayload {
    @ApiProperty({
        description: 'file type mandatory',
        enum: [AppFileEnum.images, AppFileEnum.images360],
        default: AppFileEnum.images,
        required: true,
    })
    @IsEnum(AppFileEnum)
    @IsNotEmpty()
    type: AppFileEnum;
}

