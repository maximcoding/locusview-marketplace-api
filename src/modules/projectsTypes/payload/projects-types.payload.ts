import {IProjectsTypes} from '../projects-types.schema';
import {ApiProperty} from '@nestjs/swagger';
import {IsArray, IsNotEmpty, IsString} from 'class-validator';
import {ProjectTypeEnum} from "../../../enums/projectTypeEnum";

export class ProjectsTypesPayload implements IProjectsTypes {
    @ApiProperty({
        description: 'project type',
        required: true,
        enum: ProjectTypeEnum,
        enumName: 'ProjectTypeEnum',
    })
    @IsNotEmpty()
    projectType: ProjectTypeEnum;

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
        description: 'array of projectsTypes',
    })
    @IsNotEmpty()
    @IsArray()
    projectsTypes: IProjectsTypes[];
}
