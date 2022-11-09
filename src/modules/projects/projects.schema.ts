import * as mongoose from 'mongoose';

import {ModelEnum} from '../../enums/model.enum';
import {Document, Model, model, ObjectId} from 'mongoose';
import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {CommonSchemaOptions} from '../../helpers/common-schema.options';
import {AwsFile, IAwsFile} from '../files/aws-file.schema';
import {CompanyEnum} from "../../enums/companyEnum";

const date = new Date();
const thisYear = date.getFullYear();


export interface IProject {
    _id?: string;
    title: string;
    description: string;
    location: string;
    contractor?: string[];
    requiredQualifications?: string[];
    companyName?: string;
    projectName?: string;
    projectType?: CompanyEnum;
    startDate: Date;
    dueDate: Date;
    images?: IAwsFile[];
}

export type ProjectDocument = IProject & Document;

@Schema(CommonSchemaOptions)
export class Project implements IProject {

    _id?: string;

    @Prop({type: String})
    location: string;
    @Prop({type: String})
    title: string;
    @Prop({type: String})
    description: string;

    @Prop({type: String})
    projectName: string;

    @Prop({type: String})
    companyName: string;

    @Prop({
        type: String,
        required: true,
        enum: Object.values(CompanyEnum),
    })
    projectType: CompanyEnum;

    @Prop({
        type: Date,
    })
    startDate: Date;

    @Prop({
        type: Date,
    })
    dueDate: Date;

    @Prop({type: [String]})
    requiredQualifications?: string[];

    @Prop({type: [String]})
    contractor: string[];

}

export const ProjectsSchema = SchemaFactory.createForClass(Project);

ProjectsSchema.index({'$**': 'text'});

export type IProjectModel = Model<ProjectDocument>;

export const ProjectModel: IProjectModel = model<ProjectDocument, IProjectModel>(
    ModelEnum.Projects,
    ProjectsSchema,
);

ProjectsSchema.post('save', function (doc, next) {
    next();
    // throw new Error('something went wrong');
});

ProjectsSchema.post('remove', async function (doc: ProjectDocument) {
    // await RoomModel.remove({property: doc._id}).exec();
});
