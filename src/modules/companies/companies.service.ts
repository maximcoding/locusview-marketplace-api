import {Model} from 'mongoose';
import {Injectable, Inject, Param, BadRequestException} from '@nestjs/common';
import {ModelEnum} from '../../enums/model.enum';
import {CompanyEnum} from "../../enums/companyEnum";
import {ICompany} from "./companies.schema";
import {CompanyDocument} from "../projects/projects.schema";

@Injectable()
export class CompaniesService {
    constructor(@Inject(ModelEnum.Companies) private dataModel: Model<CompanyDocument>) {
    }

    async findAll(): Promise<any[]> {
        return this.dataModel.find().exec();
    }

    async findOne(name: CompanyEnum) {
        return this.dataModel.findOne({projectType: name}).exec();
    }

    async create(data: ICompany): Promise<any> {
        const newData = new this.dataModel(data);
        try {
            return await newData.save();
        } catch (e) {
            throw new BadRequestException('Company Name Already Exist');
        }
    }
}
