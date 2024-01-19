import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { UserModule } from '@user/user.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { mailerOptions } from './config';

@Module({
  controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService],
  imports: [UserModule, MailerModule.forRootAsync(mailerOptions())],
})
export class EmailModule {}
