import {Inject, Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {Project} from '../modules/projects/projects.schema';
import {Seeder, DataFactory} from 'nestjs-seeder';

@Injectable()
export class ProjectSeeder implements Seeder {
  constructor(@InjectModel(Project.name) private readonly dataModel: Model<Project>) {}

  seed(): Promise<any> {
    const data = DataFactory.createForClass(Project).generate(50);
    return this.dataModel.insertMany(data);
  }

  drop(): Promise<any> {
    return this.dataModel.deleteMany({}) as any;
  }
}
