import {ICompany} from '../projects.schema';
import {
    ArrayUnique,
    IsArray,
    IsBoolean,
    IsCurrency,
    IsDateString,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Max,
    Min,
    MinLength,
} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';
import {CompanyEnum} from "../../../enums/companyEnum";

export class PatchProjectPayload implements ICompany {

    @ApiProperty({type: String})
    @IsOptional()
    title: string;

    @ApiProperty({description: 'free text', type: String})
    @MinLength(2)
    @IsOptional()
    @IsString()
    contractor: string;


    @ApiProperty({
        description: 'some address',
        default: '',
        type: String,
    })
    @IsString()
    address: string;

    @ApiProperty({type: [Number]})
    @IsArray()
    location: number[];

    @ApiProperty({type: Number})
    deposit: number;

    @ApiProperty({description: 'free text', type: String})
    @MinLength(2)
    @IsOptional()
    @IsString()
    description: string;

    @ApiProperty({type: Boolean})
    @IsOptional()
    @IsBoolean()
    elevator: boolean;

    @ApiProperty({description: 'start date'})
    @IsDateString()
    startDate: Date;

    @ApiProperty({description: 'date'})
    @IsDateString()
    dueDate: Date;

    @ApiProperty({
        description: 'project type mandatory',
        enum: CompanyEnum,
        enumName: 'ProjectTypeEnum',
        default: CompanyEnum.OneGas,
    })
    @IsOptional()
    @IsEnum(CompanyEnum)
    @IsString()
    @IsNotEmpty()
    projectType: CompanyEnum;

}
