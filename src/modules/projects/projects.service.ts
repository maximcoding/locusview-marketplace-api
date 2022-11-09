import {Model} from 'mongoose';
import {BadRequestException, Inject, Injectable, NotFoundException} from '@nestjs/common';
import {PatchProjectPayload} from './payload/patch-project.payload';
import {ModelEnum} from '../../enums/model.enum';
import {
    DeleteImagePayload,
    IFindAllProjectsResponse,
    QueryProjectsByProjectTypePayload,
    QueryProjectsPayload,
} from './payload/query-projects.payload';
import {CompaniesService} from '../companies/companies.service';
import {FilesService} from '../files/files.service';
import {AppFileEnum, IAppDocumentFile, IAppFile, IAwsFile} from '../files/aws-file.schema';
import {CreateProjectPayload} from './payload/create-project.payload';
import {stringToBoolean} from '../../helpers/string-boolean.parser';
import {limitMax4Files} from '../../helpers/check-limit.files';
import {FilterProjectsPayload} from './payload/filter-projects.payload';
import {IProject, ProjectDocument} from "./projects.schema";
import {ICompany} from "../companies/companies.schema";

export enum SortBy {
    new = 'new',
    old = 'old',
}

@Injectable()
export class ProjectsService {
    private companiesMap: { [key: string]: ICompany } = {};

    constructor(
        @Inject(ModelEnum.Projects) private dataModel: Model<ProjectDocument>,
        private companiesService: CompaniesService,
        private readonly filesService: FilesService,
    ) {
        (async () => {
            const companies = await this.companiesService.findAll();
            this.companiesMap = {};
            companies.forEach((cat: ICompany) => {
                this.companiesMap[cat.projectType] = cat;
            });
        })();
    }

    async findAll(params: QueryProjectsPayload, filter?: any): Promise<IFindAllProjectsResponse> {
        const query = this.dataModel.find(filter ? filter : {});
        if (stringToBoolean(params.preview)) {
            const projection = {
                title: 1,
                description: 1,
                coordinate: 1,
                contractor: 1,
                projectType: 1,
                createdAt: 1,
                updatedAt: 1,
            };
            query.populate(AppFileEnum.images, {mimetype: 1, url: 1, _id: 1, key: 1}).select(projection);
        } else {
            query
                .populate('owner', {firstName: 1, lastName: 1, _id: 1})
                .populate(AppFileEnum.images, {mimetype: 1, url: 1, _id: 1, key: 1})
        }
        if (params.sort) {
            query.sort(this.sortBy(params.sort));
        }
        const total = await this.dataModel.count(filter);
        let data = [];
        let limit = null;
        let page = null;
        if (params.page) {
            page = parseInt(params.page as any) || 1;
            limit = parseInt(params.limit as any) || 20;
            data = await query
                .skip((page - 1) * limit)
                .limit(limit)
                .exec();
        } else {
            data = await query.exec();
        }
        return {
            projects: data,
            total,
            page,
            last_page: Math.ceil(total / limit),
        };
    }

    async filterProjects(payload: FilterProjectsPayload): Promise<IFindAllProjectsResponse> {
        const filter = {};
        if (payload?.startDate) {
            filter['startDate'] = {$gte: new Date(payload.startDate).toISOString()};
        }
        if (payload?.dueDate) {
            filter['startDate'] = {$gte: new Date(payload.dueDate).toISOString()};
        }
        return await this.findAll(payload, filter);
    }

    async findWithFilesById(id: string, attr: AppFileEnum): Promise<ProjectDocument> {
        const found = await this.dataModel.findById(id).populate(attr).exec();
        if (!found) {
            throw new NotFoundException('no data found');
        }
        return found;
    }

    async findById(id: string): Promise<any> {
        const found = await this.dataModel.findById(id).exec();
        if (!found) {
            throw new NotFoundException('no data found');
        }
        return found;
    }

    async findByIdPopulate(id: string): Promise<any> {
        const found = await this.dataModel
            .findById(id)
            .exec();
        if (!found) {
            throw new NotFoundException('no data found');
        }
        return found;
    }

    async findByProjectType(query: QueryProjectsByProjectTypePayload): Promise<IFindAllProjectsResponse> {
        this.checkProjectTypeExist(query.projectType);
        return await this.findAll(query, {projectType: query.projectType});
    }

    // PROPERTY_MOCK
    async create(user, data: CreateProjectPayload): Promise<IProject> {
        this.checkProjectTypeExist(data.projectType);
        const property = new this.dataModel({...data});
        return property.save();
    }

    async updateById(id: string, data: PatchProjectPayload): Promise<ProjectDocument> {
        this.checkProjectTypeExist(data.projectType);
        try {
            return await this.dataModel.findByIdAndUpdate(id, {...data}).exec();
        } catch (e) {
            throw new BadRequestException('property could no be updated');
        }
    }

    public async uploadImages(id: string, data: Express.Multer.File[]): Promise<IProject> {
        const project = await this.findWithFilesById(id, AppFileEnum.images);
        await this.cleanPreviousFiles(project.images);
        limitMax4Files(data['files']);
        project.images = [];
        await Promise.all(
            data['files'].map(async (file) => {
                const uploaded = await this.filesService.uploadPublicFile(file, AppFileEnum.image);
                project.images.push(uploaded);
            }),
        );
        return project.save();
    }

    public async deleteImageFile(id: string, fileId: string, type: AppFileEnum): Promise<void> {
        const project = await this.findById(id);
        if (project[type]?.toString() !== fileId.trim()) {
            throw new BadRequestException('image file not found');
        }
        switch (type) {
            case AppFileEnum.images:
                await this.filesService.deletePublicFile(fileId, type);
                project.images.pull(fileId);
                break;
        }
        project.save();
    }

    public async deleteProjectImages(projectId: string, query: DeleteImagePayload): Promise<void> {
        const project = await this.findById(projectId);
        switch (query.type) {
            case AppFileEnum.image:
                if (!project.images?.length) {
                    throw new NotFoundException('project images not found');
                }
                await this.filesService.deletePublicFiles(project.images);
                project.images = [];
                break;
        }
        project.save();
    }

    private async cleanPreviousFiles(previousFiles: IAwsFile[]): Promise<IAwsFile[]> {
        const deleted = [];
        const data = previousFiles.filter((obj) => !!obj);
        if (data.length) {
            data.map(async (previous) => {
                const deletedFile = await this.filesService.deletePublicFile(previous._id, previous.fileType);
                deleted.push(deletedFile);
            });
        }
        return deleted;
    }

    private async cleanPreviousFile(previousFile: IAwsFile): Promise<void> {
        if (previousFile) {
            await this.filesService.deletePublicFile(previousFile._id, previousFile.fileType);
        }
    }

    async rate(projectId: string): Promise<ProjectDocument> {
        return this.dataModel.findOneAndUpdate({_id: projectId}, {$inc: {rating: 1}}).exec();
    }

    async deleteById(id: string): Promise<void> {
        const found = await this.findById(id);
        await this.cleanPreviousFiles([
            ...found.images,
        ]);
        await this.dataModel.deleteOne({_id: found._id});
    }

    private checkProjectTypeExist(projectType: string) {
        const obj = this.companiesMap[projectType];
        if (!obj) {
            throw new NotFoundException('project type does not exist');
        }
    }

    private sortBy(sort: SortBy): string {
        let type;
        switch (sort) {
            case SortBy.new:
                type = {createdAt: -1};
                break;
            case SortBy.old:
                type = {createdAt: +1};
                break;
        }
        return type;
    }
}
