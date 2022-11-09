import {Inject, Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {Seeder, DataFactory} from 'nestjs-seeder';
import {ProjectsTypes} from '../modules/projectsTypes/projects-types.schema';

export const ProjectsTypesMock = [
    {
        name: 'OneGas',
        photoUrl: 'https://i.postimg.cc/xT8TY3Ys/appartments.jpg',
    },
];

@Injectable()
export class ProjectsTypesSeeder implements Seeder {
    constructor(@InjectModel(ProjectsTypes.name) private readonly dataModel: Model<ProjectsTypes>) {
    }

    seed(): Promise<any> {
        return this.dataModel.insertMany(ProjectsTypesMock);
    }

    drop(): Promise<any> {
        return this.dataModel.deleteMany({}) as any;
    }
}
