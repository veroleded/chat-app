import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { LoginDto, RegistrationUserDto } from './dto';
import { AuthService } from './auth.service';
import { Tokens } from './interfaces';
import { Response, Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { Cookies, Public, UserAgent } from '@common/decorators';
import { GoogleGuard } from './guards/google.guard';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, map, mergeMap } from 'rxjs';
import { handleTimeoutAndErrors } from '@common/helpers';
import { YandexGuard } from './guards/yandex.guard';
import { Provider } from '@prisma/client';
import { EmailService } from '@email/email.service';

const REFRESH_TOKEN = 'refreshtoken';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly emailService: EmailService,
  ) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('registration')
  @Public()
  async registration(
    @Body() dto: RegistrationUserDto,
    @UserAgent() agent: string,
    @Res() res: Response,
  ) {
    const tokens = await this.authService.register(dto, agent);

    this.setRefreshTokenToCookies(tokens, res);
  }

  @Post('login')
  @Public()
  async login(
    @Body() dto: LoginDto,
    @Res() res: Response,
    @UserAgent() agent: string,
  ) {
    const tokens = await this.authService.login(dto, agent);

    if (!tokens) {
      throw new BadRequestException(
        `Failed to login with the data ${JSON.stringify(dto)}`,
      );
    }

    this.setRefreshTokenToCookies(tokens, res);
  }

  @Get('activate/:code')
  @Public()
  async activate(@Param('code') code: string, @Res() res: Response) {
    console.log(code);
    await this.authService.activate(code);

    res.redirect(this.configService.get('CLIENT_URL'));
  }

  @Get('logout')
  async logout(
    @Cookies(REFRESH_TOKEN) refreshToken: string,
    @Res() res: Response,
  ) {
    if (!refreshToken) {
      return res.sendStatus(HttpStatus.OK);
    }

    await this.authService.deleteRefreshToken(refreshToken);
    res.cookie(REFRESH_TOKEN, '', {
      httpOnly: true,
      secure: true,
      expires: new Date(),
    });

    res.sendStatus(HttpStatus.OK);
  }

  @Get('refresh')
  async refreshTokens(
    @Cookies(REFRESH_TOKEN) refreshToken: string,
    @Res() res: Response,
    @UserAgent() agent: string,
  ) {
    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const tokens = await this.authService.refreshTokens(refreshToken, agent);
    if (!tokens) {
      throw new UnauthorizedException();
    }

    this.setRefreshTokenToCookies(tokens, res);
  }

  private setRefreshTokenToCookies(tokens: Tokens, res: Response) {
    if (!tokens) {
      throw new UnauthorizedException();
    }

    res.cookie(REFRESH_TOKEN, tokens.refreshToken.token, {
      httpOnly: true,
      sameSite: 'lax',
      expires: tokens.refreshToken.exp,
      secure:
        this.configService.get('NODE_ENV', 'development') === 'production',
      path: '/',
    });
    return res
      .status(HttpStatus.CREATED)
      .json({ accessToken: tokens.accessToken });
  }

  @UseGuards(GoogleGuard)
  @Public()
  @Get('google')
  googleAuth() {}

  @Public()
  @UseGuards(GoogleGuard)
  @Get('google/callback')
  googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    const token = req.user['accessToken'];
    return res.redirect(
      `http://localhost:3000/api/auth/success-google?token=${token}`,
    );
  }

  @Public()
  @Get('success-google')
  async successGoogle(
    @Query('token') token: string,
    @UserAgent() agent: string,
    @Res() res: Response,
  ) {
    await firstValueFrom(
      this.httpService
        .get(
          `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`,
        )
        .pipe(
          mergeMap(({ data: { email } }) =>
            this.authService.providerAuth(email, agent, Provider.GOOGLE),
          ),
          map((data) => this.setRefreshTokenToCookies(data, res)),
          handleTimeoutAndErrors(),
        ),
    );
  }

  @Public()
  @UseGuards(YandexGuard)
  @Get('yandex')
  yandexAuth() {}

  @Public()
  @UseGuards(YandexGuard)
  @Get('yandex/callback')
  yandexAuthCallback(@Req() req: Request, @Res() res: Response) {
    const token = req.user['accessToken'];
    return res.redirect(
      `http://localhost:3000/api/auth/success-yandex?token=${token}`,
    );
  }

  @Public()
  @Get('success-yandex')
  async successYandex(
    @Query('token') token: string,
    @UserAgent() agent: string,
    @Res() res: Response,
  ) {
    await firstValueFrom(
      this.httpService
        .get(`https://login.yandex.ru/info?format=json&oauth_token=${token}`)
        .pipe(
          mergeMap(({ data: { default_email } }) =>
            this.authService.providerAuth(
              default_email,
              agent,
              Provider.YANDEX,
            ),
          ),
          map((data) => this.setRefreshTokenToCookies(data, res)),
          handleTimeoutAndErrors(),
        ),
    );
  }
}
