import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import {ModelEnum} from '../../enums/model.enum';
import {ProjectstypesService} from './projects-types.service';
import {IProjectsTypes} from './projects-types.schema';
import {ProjectsTypesPayload} from './payload/projects-types.payload';
import {ApiTags} from '@nestjs/swagger';
import {ProjectTypeEnum} from "../../enums/projectTypeEnum";

@ApiTags('House Categories')
@Controller(ModelEnum.ProjectsTypes)
export class ProjectsTypesController {
    constructor(private service: ProjectstypesService) {
    }

    @Get()
    async findAll(): Promise<IProjectsTypes[]> {
        // return categoriesDataArray as ICategory[];
        return await this.service.findAll();
    }

    @Get(':name')
    async getProjectType(@Param() projectType: ProjectTypeEnum): Promise<IProjectsTypes> {
        return await this.service.findOne(projectType);
    }

    @Post()
    async create(@Body() payload: ProjectsTypesPayload): Promise<IProjectsTypes> {
        return await this.service.create(payload);
    }
}
