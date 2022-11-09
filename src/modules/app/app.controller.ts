import {Controller, Get, Req} from '@nestjs/common';
import {AppService} from './app.service';
import {ApiTags} from '@nestjs/swagger';

@ApiTags('App')
@Controller('')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('ping')
  ping(@Req() req): Partial<string> {
    return this.appService.ping();
  }
}
