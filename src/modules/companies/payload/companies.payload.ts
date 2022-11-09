import {ApiProperty} from '@nestjs/swagger';
import {IsArray, IsNotEmpty, IsString} from 'class-validator';
import {CompanyEnum} from "../../../enums/companyEnum";
import {ICompany} from "../companies.schema";

export class CompaniesPayload implements ICompany {
    @ApiProperty({
        description: 'project type',
        required: true,
        enum: CompanyEnum,
        enumName: 'ProjectTypeEnum',
    })
    @IsNotEmpty()
    projectType: CompanyEnum;

    @IsString()
    @ApiProperty({
        description: 'photo url',
        required: true,
    })
    @IsNotEmpty()
    photoUrl: string;
}

export class ProjectsTypesBulkPayload {
    @ApiProperty({
        description: 'array of companies',
    })
    @IsNotEmpty()
    @IsArray()
    companies: ICompany[];
}
