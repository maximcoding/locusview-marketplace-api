import * as mongoose from 'mongoose';

import {ModelEnum} from '../../enums/model.enum';
import {Document, Model, model, ObjectId} from 'mongoose';
import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {CommonSchemaOptions} from '../../helpers/common-schema.options';
import {AwsFile, IAwsFile} from '../files/aws-file.schema';
import {CompanyEnum} from "../../enums/companyEnum";

const date = new Date();
const thisYear = date.getFullYear();


export interface ICompany {
    _id?: string;
    title: string;
    description: string;
    contractor?: string;
    location: number[];
    companyName?: string;
    projectName?: string;
    projectType?: CompanyEnum;
    startDate: Date;
    dueDate: Date;
    images?: IAwsFile[];
}

export type CompanyDocument = ICompany & Document;

@Schema(CommonSchemaOptions)
export class Project implements ICompany {

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

export type IProjectModel = Model<CompanyDocument>;

export const ProjectModel: IProjectModel = model<CompanyDocument, IProjectModel>(
    ModelEnum.Projects,
    ProjectsSchema,
);

ProjectsSchema.post('save', function (doc, next) {
    next();
    // throw new Error('something went wrong');
});

ProjectsSchema.post('remove', async function (doc: CompanyDocument) {
    // await RoomModel.remove({property: doc._id}).exec();
});
