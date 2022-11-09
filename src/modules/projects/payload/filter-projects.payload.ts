import {ApiProperty} from '@nestjs/swagger';
import {
    IsDateString,
    IsOptional,
} from 'class-validator';
import {QueryProjectsPayload} from './query-projects.payload';

export class FilterProjectsPayload extends QueryProjectsPayload {

    @ApiProperty({
        description: 'publish date',
        type: Date,
        required: false,
        default: new Date('2020').toISOString(),
    })
    @IsDateString()
    @IsOptional()
    startDate: Date;


    @ApiProperty({description: 'date'})
    @IsDateString()
    dueDate: Date;

}
