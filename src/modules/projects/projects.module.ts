import {forwardRef, Module} from '@nestjs/common';
import {ProjectsService} from './projects.service';
import {ProjectsController} from './projects.controller';
import {DatabaseModule} from '../database';
import {projectsProviders} from './projects.provider';
import {ProjectsTypesModule} from '../projectsTypes/projects-types.module';
import {FilesModule} from '../files/files.module';
import {UserModule} from "../users/user.module";

@Module({
    imports: [DatabaseModule, ProjectsTypesModule, FilesModule, UserModule],
    providers: [ProjectsService, ...projectsProviders],
    exports: [ProjectsService],
    controllers: [ProjectsController],
})
export class ProjectsModule {
}
