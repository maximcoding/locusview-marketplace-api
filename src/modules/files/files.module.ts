import {Module} from '@nestjs/common';
import {FilesService} from './files.service';
import {ConfigModule} from '@nestjs/config';
import {DatabaseModule} from '../database';
import {filesProviders} from './files.providers';
import {FilesController} from './files.controller';

@Module({
  imports: [DatabaseModule, ConfigModule],
  providers: [FilesService, ...filesProviders],
  exports: [FilesService],
  controllers: [FilesController],
})
export class FilesModule {}
