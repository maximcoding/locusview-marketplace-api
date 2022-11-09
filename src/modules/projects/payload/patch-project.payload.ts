import {IProject} from '../projects.schema';
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
import {ProjectTypeEnum} from "../../../enums/projectTypeEnum";

export class PatchProjectPayload implements IProject {

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
        description: 'category mandatory',
        enum: ProjectTypeEnum,
        enumName: 'CategoryEnum',
        default: ProjectTypeEnum.OneGas,
    })
    @IsOptional()
    @IsEnum(ProjectTypeEnum)
    @IsString()
    @IsNotEmpty()
    projectType: ProjectTypeEnum;

}
