import {seeder} from 'nestjs-seeder';
import {ProjectSeeder} from './seeders/project-seeders.service';
import {MongooseModule} from '@nestjs/mongoose';
import {Project, ProjectsSchema} from './modules/projects/projects.schema';
import {UsersSeeder} from './seeders/users.seeder';
import {CompaniesSeeder} from './seeders/projects-types-seeder.service';
import {User, UserSchema} from './modules/users/schemas/user.schema';
import {Companies, CompaniesSchema} from "./modules/companies/companies.schema";

// const url = 'mongodb+srv://developer:38Hn7ioL4PweEM94@cluster0.gx2mi.mongodb.net/hackathondb?retryWrites=true&w=majority';

seeder({
  imports: [
    // MongooseModule.forRoot(url),
    MongooseModule.forFeature([
      {name: User.name, schema: UserSchema},
      {name: Companies.name, schema: CompaniesSchema},
      {name: Project.name, schema: ProjectsSchema},
    ]),
  ],
}).run([UsersSeeder, CompaniesSeeder, ProjectSeeder]);
