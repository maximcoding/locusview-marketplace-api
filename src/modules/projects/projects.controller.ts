import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Put,
    Query,
    UploadedFile,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import {ModelEnum} from '../../enums/model.enum';
import {ProjectsService} from './projects.service';
import {CreateProjectPayload} from './payload/create-project.payload';
import {PatchProjectPayload} from './payload/patch-project.payload';
import {ApiBearerAuth, ApiConsumes, ApiCreatedResponse, ApiTags} from '@nestjs/swagger';
import {ObjectIdValidationPipe} from '../../helpers/object-id.validation.pipe';
import {
    IFindAllProjectsResponse,
    QueryProjectsByTextPayload,
    QueryProjectsPayload,
} from './payload/query-projects.payload';
import {FileFieldsInterceptor, FileInterceptor} from '@nestjs/platform-express';
import {ApiMultiFile} from '../files/api-multiple-files.decorator';
import {AuthUser} from '../users/user.decorator';
import {UserDocument} from '../users/schemas/user.schema';
import {FilterProjectsPayload} from './payload/filter-projects.payload';
import {IUser} from '../users/interfaces/user.interface';
import {IProject} from "./projects.schema";

const multerOptions = {limits: {fileSize: +process.env.APP_MAX_FILE_SIZE}};

@ApiTags('Projects')
@Controller(ModelEnum.Projects)
export class ProjectsController {
    constructor(private service: ProjectsService) {
    }

    @Get('all')
    async findAll(@Query() payload: QueryProjectsPayload): Promise<IFindAllProjectsResponse> {
        return await this.service.findAll(payload);
    }

    // @Get('me')
    // async findMine(
    //     @AuthUser() user: IUser,
    //     @Query() payload: QueryProjectsPayload,
    // ): Promise<IFindAllProjectsResponse> {
    //     return await this.service.findAll(payload, {user: user._id});
    // }

    @Post('all/filter')
    async filterProjects(@Body() payload: FilterProjectsPayload): Promise<IFindAllProjectsResponse> {
        return await this.service.filterProjects(payload);
    }

    @Get(':id')
    async findById(@Param('id', ObjectIdValidationPipe) id: string): Promise<IProject> {
        return await this.service.findByIdPopulate(id);
    }

    @Get('search/freeText')
    async search(@Query() query: QueryProjectsByTextPayload): Promise<IFindAllProjectsResponse> {
        let filter = {};
        if (query.freeText) {
            const regexStr = new RegExp(query.freeText?.trim(), 'i');
            filter = {
                $or: [{title: regexStr}, {description: regexStr}],
            };
        }
        return await this.service.findAll(query, filter);
    }

    @Patch(':id')
    async updateById(
        @Param('id', ObjectIdValidationPipe) id: string,
        @Body() data: PatchProjectPayload,
    ): Promise<IProject> {
        return await this.service.updateById(id, data);
    }


    @Post(':id/upload/images')
    @ApiConsumes('multipart/form-data')
    @ApiMultiFile()
    @UseInterceptors(FileFieldsInterceptor([{name: 'files', maxCount: 4}], multerOptions))
    async uploadImages(
        @Param('id', ObjectIdValidationPipe) id: string,
        @UploadedFiles() data: Express.Multer.File[],
    ): Promise<IProject> {
        return await this.service.uploadImages(id, data);
    }

    @Post('create')
    @ApiCreatedResponse({description: 'The project has been successfully created.'})
    async create(@AuthUser() user: UserDocument, @Body() data: CreateProjectPayload): Promise<IProject> {
        return await this.service.create(user, data);
    }

    @Delete(':id')
    async remove(@Param('id', ObjectIdValidationPipe) id: string) {
        return await this.service.deleteById(id);
    }
}
