import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class CronService {
  @Cron('1/15 * * * 1-5') // generator: https://crontab.guru/
  showSomeInfo() {
    console.log('some info', new Date());
  }
}
