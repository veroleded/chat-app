import { Module } from '@nestjs/common';
import { EmailerService } from './mailer.service';
import { UserModule } from '@user/user.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { mailerOptions } from './config';

@Module({
  controllers: [],
  providers: [EmailerService],
  exports: [EmailerService],
  imports: [UserModule, MailerModule.forRootAsync(mailerOptions())],
})
export class EmailModule {}
