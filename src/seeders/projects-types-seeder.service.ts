import {Inject, Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {Seeder, DataFactory} from 'nestjs-seeder';
import {CompanyEnum} from "../enums/companyEnum";
import {Companies} from "../modules/companies/companies.schema";

export const CompaniesMock = [
    {
        name: 'OneGas',
        photoUrl: 'https://i.postimg.cc/xT8TY3Ys/appartments.jpg',
    },
];

@Injectable()
export class CompaniesSeeder implements Seeder {
    constructor(@InjectModel(Companies.name) private readonly dataModel: Model<CompanyEnum>) {
    }

    seed(): Promise<any> {
        return this.dataModel.insertMany(CompaniesMock);
    }

    drop(): Promise<any> {
        return this.dataModel.deleteMany() as any;
    }
}
