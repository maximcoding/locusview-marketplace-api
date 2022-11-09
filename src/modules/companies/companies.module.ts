import {Module} from '@nestjs/common';
import {CompaniesService} from './companies.service';
import {CompaniesController} from './companies.controller';
import {DatabaseModule} from '../database';
import {companiesProvider} from "./companies.provider";

@Module({
  imports: [DatabaseModule],
  providers: [CompaniesService, ...companiesProvider],
  exports: [CompaniesService],
  controllers: [CompaniesController],
})
export class CompaniesModule {}
