import { DatabaseService } from '@database/database.service';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '@user/user.service';

@Injectable()
export class EmailService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly userService: UserService,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async activate(code: string) {
    const user = await this.userService.findOne(code);

    if (!user) {
      throw new UnauthorizedException("The user doesn't exist");
    }

    return await this.databaseService.user.update({
      where: { id: user.id },
      data: { isActivated: true },
    });
  }

  async sendActivationEmail(
    email: string,
    activationToken: string,
  ): Promise<void> {
    const link = `${this.configService.get(
      'API_URL',
    )}/api/email/activate/${activationToken}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Активация аккаунта',
      html: `
        <div>
          <h1>Активация профиля</h1>
          <p>
            Для активации перейдите по <a href="${link}">ссылке</a>
          </p>
        </div>
      `, // Путь к HTML-шаблону письма (например, 'src/email-templates/activation.hbs')
      context: { activationToken },
    });
  }
}
