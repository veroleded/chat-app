import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { UserModule } from '@user/user.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { mailerOptions } from './config';

@Module({
  controllers: [],
  providers: [EmailService],
  exports: [EmailService],
  imports: [UserModule, MailerModule.forRootAsync(mailerOptions())],
})
export class EmailModule {}
