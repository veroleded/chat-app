import { MailerOptions } from '@nestjs-modules/mailer';
import { MailerAsyncOptions } from '@nestjs-modules/mailer/dist/interfaces/mailer-async-options.interface';
import { ConfigService } from '@nestjs/config';

export const options = (config: ConfigService): MailerOptions => ({
  transport: {
    host: config.get('SMTP_HOST'), // Убедитесь, что в .env есть значение для SMTP_HOST
    port: config.get('SMTP_PORT') ?? 587,
    secure: false,
    auth: {
      user: config.get('SMTP_EMAIL'), // Убедитесь, что в .env есть значение для SMTP_EMAIL
      pass: config.get('SMTP_PASSWORD'), // Убедитесь, что в .env есть значение для SMTP_PASSWORD
    },
    tls: {
      rejectUnauthorized: false, // this did the trick
    },
  },
  defaults: {
    from: '"No Reply" <noreply@example.com>',
  },
});

export const mailerOptions = (): MailerAsyncOptions => ({
  inject: [ConfigService],
  useFactory: (config: ConfigService) => options(config),
});
