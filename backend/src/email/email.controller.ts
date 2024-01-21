import { Public } from '@common/decorators';
import { Controller, Res, Get, Param } from '@nestjs/common';
import { EmailService } from './email.service';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Controller('email')
export class EmailController {
  constructor(
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  @Get('activate/:code')
  @Public()
  async activate(@Param('code') code: string, @Res() res: Response) {
    await this.emailService.activate(code);
    res.redirect(this.configService.get('CLIENT_URL'));
  }
}
