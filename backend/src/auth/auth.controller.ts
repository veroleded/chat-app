import {
  BadRequestException,
  Body,
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
} from '@nestjs/common';
import { LoginDto, RegistrationUserDto } from './dto';
import { AuthService } from './auth.service';
import { JwtPayload, Tokens } from './interfaces';
import { Response, Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { Cookies, CurrentUser, Public, UserAgent } from '@common/decorators';
import { GoogleGuard } from './guards/google.guard';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, map, mergeMap } from 'rxjs';
import { handleTimeoutAndErrors } from '@common/helpers';
import { YandexGuard } from './guards/yandex.guard';
import { Provider } from '@prisma/client';
import { AuthResponse } from './responses/auth.response';

const REFRESH_TOKEN = 'refreshtoken';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  @Public()
  @Post('registration')
  async registration(
    @Body() dto: RegistrationUserDto,
    @UserAgent() agent: string,
    @Res() res: Response,
  ) {
    const { tokens, user } = await this.authService.register(dto, agent);

    this.setRefreshTokenToCookies(tokens, res);

    return res
      .status(HttpStatus.CREATED)
      .json(new AuthResponse(user, tokens.accessToken));
  }

  @Post('login')
  @Public()
  async login(
    @Body() dto: LoginDto,
    @Res() res: Response,
    @UserAgent() agent: string,
  ) {
    const { tokens, user } = await this.authService.login(dto, agent);

    if (!tokens) {
      throw new BadRequestException(
        `Failed to login with the data ${JSON.stringify(dto)}`,
      );
    }

    this.setRefreshTokenToCookies(tokens, res);
    return res
      .status(HttpStatus.CREATED)
      .json(new AuthResponse(user, tokens.accessToken));
  }

  @Get('activate/:code')
  @Public()
  async activate(@Param('code') code: string, @Res() res: Response) {
    const user = await this.authService.activate(code);

    if (!user) {
      res.redirect(`${this.configService.get('CLIENT_URL')}/activate`);
      return;
    }

    res.redirect(`${this.configService.get('CLIENT_URL')}/chat`);
  }

  @Get('activateMail')
  async sendActivateMail(@CurrentUser() dto: JwtPayload) {
    await this.authService.sendActivateMail(dto.email);
    return HttpStatus.OK;
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
  @Public()
  async refreshTokens(
    @Cookies(REFRESH_TOKEN) refreshToken: string,
    @Res() res: Response,
    @UserAgent() agent: string,
  ) {
    console.log('refresh');
    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const { tokens, user } = await this.authService.refreshTokens(
      refreshToken,
      agent,
    );

    if (!tokens) {
      throw new UnauthorizedException();
    }

    this.setRefreshTokenToCookies(tokens, res);
    return res
      .status(HttpStatus.CREATED)
      .json(new AuthResponse(user, tokens.accessToken));
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
          map((data) => {
            this.setRefreshTokenToCookies(data, res);
            return res
              .status(HttpStatus.CREATED)
              .json({ accessToken: data.accessToken });
          }),
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
          map((data) => {
            this.setRefreshTokenToCookies(data, res);
            return res
              .status(HttpStatus.CREATED)
              .json({ accessToken: data.accessToken });
          }),
          handleTimeoutAndErrors(),
        ),
    );
  }
}
