import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import {ModelEnum} from '../../enums/model.enum';
import {CompaniesService} from './companies.service';
import {ApiTags} from '@nestjs/swagger';
import {CompaniesPayload} from "./payload/companies.payload";
import {ICompany} from "./companies.schema";

@ApiTags('Companies ( Project Types)')
@Controller(ModelEnum.Companies)
export class CompaniesController {
    constructor(private service: CompaniesService) {
    }

    @Get()
    async findAll(): Promise<ICompany[]> {
        return await this.service.findAll();
    }

    @Post()
    async create(@Body() payload: CompaniesPayload): Promise<ICompany> {
        return await this.service.create(payload);
    }
}
