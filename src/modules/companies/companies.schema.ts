import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';
import {CommonSchemaOptions} from '../../helpers/common-schema.options';
import {Factory} from 'nestjs-seeder';
import {CompanyEnum} from "../../enums/companyEnum";

export interface ICompany {
  _id?: string;
  projectType: CompanyEnum;
  photoUrl: string;
}

@Schema(CommonSchemaOptions)
export class Companies implements ICompany {
  @Factory((faker, ctx) => `${ctx.name}`)
  @Prop({
    type: String,
    required: true,
    enum: Object.values(CompanyEnum),
    unique: true,
  })
  projectType: CompanyEnum;

  @Factory((faker, ctx) => `${ctx.photoUrl}`)
  @Prop({type: String, required: true})
  photoUrl: string;
}

export type ProjectsTypesDocument = Companies & Document;

export const CompaniesSchema = SchemaFactory.createForClass(Companies);
