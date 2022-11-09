import {Model} from 'mongoose';
import {Injectable, Inject, Param} from '@nestjs/common';
import {ProjectsTypesDocument, IProjectsTypes} from './projects-types.schema';
import {ModelEnum} from '../../enums/model.enum';
import {ProjectTypeEnum} from "../../enums/projectTypeEnum";

@Injectable()
export class ProjectstypesService {
  constructor(@Inject(ModelEnum.Companies) private dataModel: Model<ProjectsTypesDocument>) {}

  async findAll(): Promise<IProjectsTypes[]> {
    return this.dataModel.find().exec();
  }

  async findOne(name: ProjectTypeEnum) {
    return this.dataModel.findOne({projectType: name}).exec();
  }

  async create(data: IProjectsTypes): Promise<IProjectsTypes> {
    const newData = new this.dataModel(data);
    return newData.save();
  }
}
