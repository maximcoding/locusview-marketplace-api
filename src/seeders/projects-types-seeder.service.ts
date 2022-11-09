import {Inject, Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {Seeder, DataFactory} from 'nestjs-seeder';
import {ProjectsTypes} from '../modules/projectsTypes/projects-types.schema';

export const categoriesDataArray = [
  {
    name: 'Apartments',
    photoUrl: 'https://i.postimg.cc/xT8TY3Ys/appartments.jpg',
  },
  {
    name: 'DuplexApartments',
    photoUrl: 'https://i.postimg.cc/T34cC6JR/duplex.jpg',
  },
  {
    name: 'Penthouses',
    photoUrl: 'https://i.postimg.cc/MXknv97J/Screen-Shot-2021-11-06-at-17-09-13.png',
  },
  {
    name: 'Condos',
    photoUrl: 'https://i.postimg.cc/BnYmkD4f/condos.jpg',
  },
  {
    name: 'Houses',
    photoUrl: 'https://i.postimg.cc/g0fjMM7X/Screen-Shot-2021-11-06-at-17-11-10.png',
  },
  {
    name: 'Offices',
    photoUrl: 'https://i.postimg.cc/76DwRpqR/office.jpg',
  },
  {
    name: 'Land',
    photoUrl: 'https://i.postimg.cc/Wb0SNCV8/land.png',
  },
  {
    name: 'Clinics',
    photoUrl: 'https://i.postimg.cc/vmcNZDDw/clinics.jpg',
  },
  {
    name: 'Basement',
    photoUrl: 'https://i.postimg.cc/kD3jjyyn/basement.png',
  },
  {
    name: 'CommunityCenter',
    photoUrl: 'https://i.postimg.cc/CxHFsP4x/community.png',
  },
];

@Injectable()
export class ProjectsTypesSeeder implements Seeder {
  constructor(@InjectModel(ProjectsTypes.name) private readonly dataModel: Model<ProjectsTypes>) {}

  seed(): Promise<any> {
    return this.dataModel.insertMany(categoriesDataArray);
  }

  drop(): Promise<any> {
    return this.dataModel.deleteMany({}) as any;
  }
}
