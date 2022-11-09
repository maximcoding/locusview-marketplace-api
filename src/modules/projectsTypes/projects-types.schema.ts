import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';
import {CommonSchemaOptions} from '../../helpers/common-schema.options';
import {Factory} from 'nestjs-seeder';
import {ProjectTypeEnum} from "../../enums/projectTypeEnum";

export interface IProjectsTypes {
  _id?: string;
  projectType: ProjectTypeEnum;
  photoUrl: string;
}

@Schema(CommonSchemaOptions)
export class ProjectsTypes implements IProjectsTypes {
  @Factory((faker, ctx) => `${ctx.name}`)
  @Prop({
    type: String,
    required: true,
    enum: Object.values(ProjectTypeEnum),
    unique: true,
  })
  projectType: ProjectTypeEnum;

  @Factory((faker, ctx) => `${ctx.photoUrl}`)
  @Prop({type: String, required: true})
  photoUrl: string;
}

export type ProjectsTypesDocument = ProjectsTypes & Document;

export const ProjectsTypesSchema = SchemaFactory.createForClass(ProjectsTypes);
