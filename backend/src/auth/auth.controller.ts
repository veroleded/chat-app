import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto, RegistrationUserDto } from './dto';
import { AuthService } from './auth.service';
import { Tokens } from './interfaces';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { Cookies, Public, UserAgent } from '@common/decorators';

const REFRESH_TOKEN = 'refreshtoken';
@Public()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('registration')
  async registration(@Body() dto: RegistrationUserDto) {
    const user = await this.authService.register(dto);
    if (!user) {
      throw new BadRequestException(
        `Failed to register users with the data ${JSON.stringify(dto)}`,
      );
    }
    return user;
  }

  @Post('login')
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

    // return { accessToken: tokens.accessToken };
    return res
      .status(HttpStatus.CREATED)
      .json({ accessToken: tokens.accessToken });
  }
}
