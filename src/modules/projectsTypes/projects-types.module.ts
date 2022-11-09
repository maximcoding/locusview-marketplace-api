import {Module} from '@nestjs/common';
import {ProjectstypesService} from './projects-types.service';
import {ProjectsTypesController} from './projects-types.controller';
import {DatabaseModule} from '../database';
import {categoriesProviders} from './projects-types.provider';

@Module({
  imports: [DatabaseModule],
  providers: [ProjectstypesService, ...categoriesProviders],
  exports: [ProjectstypesService],
  controllers: [ProjectsTypesController],
})
export class ProjectsTypesModule {}
