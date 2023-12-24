import { Module } from '@nestjs/common';
import mailerConfig = require('../mailerconfig');
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';
@Module({
  imports: [MailerModule.forRoot(mailerConfig)],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
