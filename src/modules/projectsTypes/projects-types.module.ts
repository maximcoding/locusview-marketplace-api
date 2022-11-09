import {Module} from '@nestjs/common';
import {ProjectstypesService} from './projects-types.service';
import {ProjectsTypesController} from './projects-types.controller';
import {DatabaseModule} from '../database';
import {projectsTypesProvides} from './projects-types.provider';

@Module({
  imports: [DatabaseModule],
  providers: [ProjectstypesService, ...projectsTypesProvides],
  exports: [ProjectstypesService],
  controllers: [ProjectsTypesController],
})
export class ProjectsTypesModule {}
