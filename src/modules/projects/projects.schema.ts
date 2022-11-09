import * as mongoose from 'mongoose';

import {ModelEnum} from '../../enums/model.enum';
import {Document, Model, model, ObjectId} from 'mongoose';
import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {CommonSchemaOptions} from '../../helpers/common-schema.options';
import {AwsFile, IAwsFile} from '../files/aws-file.schema';
import {ProjectTypeEnum} from "../../enums/projectTypeEnum";

const date = new Date();
const thisYear = date.getFullYear();


export interface IProject {
    _id?: string;
    title: string;
    description: string;
    contractor?: string;
    location: number[];
    companyName?: string;
    projectName?: string;
    projectType?: ProjectTypeEnum;
    startDate: Date;
    dueDate: Date;
    images?: IAwsFile[];
}

export type ProjectDocument = IProject & Document;

@Schema(CommonSchemaOptions)
export class Project implements IProject {

    _id?: string;

    @Prop({type: String})
    title: string;

    @Prop({type: String})
    description: string;

    @Prop({type: String})
    projectName: string;

    @Prop({type: String})
    companyName: string;


    @Prop({type: String})
    contractor: string;

    @Prop({
        type: [Number],
        default: [0, 0],
        required: true,
    })
    location: number[];

    @Prop({
        type: String,
        required: true,
        enum: Object.values(ProjectTypeEnum),
    })
    projectType: ProjectTypeEnum;

    @Prop({
        type: Date,
    })
    startDate: Date;

    @Prop({
        type: Date,
    })
    dueDate: Date;

    @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: ModelEnum.Files}]})
    images: AwsFile[];

    // @Factory((faker) => faker.random.arrayElement(Object.values(FacilitiesEnum)))
    // @Prop({
    //     type: [String],
    //     enum: Object.values(FacilitiesEnum),
    // })
    // facilities: FacilitiesEnum[];
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