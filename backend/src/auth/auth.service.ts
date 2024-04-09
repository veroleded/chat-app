import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto, RegistrationUserDto } from './dto';
import { UserService } from '@user/user.service';
import { Tokens } from './interfaces';
import { JwtService } from '@nestjs/jwt';
import { Provider, Token, User } from '@prisma/client';
import { DatabaseService } from '@database/database.service';
import { v4 } from 'uuid';
import { add } from 'date-fns';
import * as argon2 from 'argon2';
import { EmailerService } from '@email/mailer.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly databaseService: DatabaseService,
    private readonly emailService: EmailerService,
    private readonly configService: ConfigService,
  ) {}

  async register(
    dto: RegistrationUserDto,
    agent: string,
  ): Promise<{ tokens: Tokens; user: User }> {
    const emailExist: User = await this.userService
      .findOne(dto.email)
      .catch((error) => {
        this.logger.error(error);
        return null;
      });

    const nicknameExist: User = await this.userService
      .findOne(dto.nickname)
      .catch((error) => {
        this.logger.error(error);
        return null;
      });

    const code = this.createActivationCode();

    if (emailExist) {
      if (emailExist.isActivated) {
        throw new ConflictException(
          'Пользователь с таким email уже зарегистрирован',
        );
      }

      if (nicknameExist && emailExist.email !== nicknameExist.email) {
        throw new ConflictException(
          'Пользователь с таким псевдонимом уже зарегистрирован',
        );
      }

      const user = await this.userService.update({
        ...dto,
        activationCode: code,
      });

      await this.emailService.sendActivationEmail(user.email, code);
      const tokens = await this.generateTokens(user, agent);
      return { user, tokens };
    }

    if (nicknameExist) {
      throw new ConflictException(
        'Пользователь с таким псевдонимом уже зарегистрирован',
      );
    }

    const user = await this.userService
      .create({ activationCode: code, ...dto })
      .catch((err) => {
        this.logger.error(err);
        return null;
      });

    if (!user) {
      throw new BadRequestException(
        `Failed to register users with the data ${JSON.stringify(dto)}`,
      );
    }

    await this.emailService.sendActivationEmail(user.email, code);
    const tokens = await this.generateTokens(user, agent);

    return { tokens, user };
  }

  async login(
    dto: LoginDto,
    agent: string,
  ): Promise<{ tokens: Tokens; user: User }> {
    const user: User = await this.userService
      .findOne(dto.email, true)
      .catch((error) => {
        this.logger.error(error);
        return null;
      });

    if (!user || !(await argon2.verify(user.password, dto.password))) {
      throw new UnauthorizedException('Неправильный email или пароль');
    }

    const tokens = await this.generateTokens(user, agent);
    return { tokens, user };
  }

  async deleteRefreshToken(token: string) {
    return this.databaseService.token.delete({ where: { token } });
  }

  async refreshTokens(
    refreshToken: string,
    agent: string,
  ): Promise<{ tokens: Tokens; user: User }> {
    const token = await this.deleteRefreshToken(refreshToken);

    if (!token || new Date(token.exp) < new Date()) {
      throw new UnauthorizedException();
    }

    const user = await this.userService.findOne(token.userId);

    const tokens = await this.generateTokens(user, agent);
    return { tokens, user };
  }

  async activate(code: string) {
    const user = await this.userService.findOne(code);

    if (!user) {
      return null;
    }

    try {
      this.jwtService.verify(code);
    } catch (e) {
      return null;
    }

    return await this.databaseService.user.update({
      where: { id: user.id },
      data: { isActivated: true },
    });
  }

  async providerAuth(email: string, agent: string, provider: Provider) {
    const userExist = await this.userService.findOne(email);

    if (userExist) {
      const updatedUser = await this.userService
        .updateOnProvider({ email, provider })
        .catch((err) => {
          this.logger.error(err);
          return null;
        });

      return this.generateTokens(updatedUser, agent);
    }
    const nickname = `user${v4()}`;
    const activationCode = this.createActivationCode();
    const user = await this.userService
      .create({ email, provider, nickname, activationCode })
      .catch((err) => {
        this.logger.error(err);
        return null;
      });

    if (!user) {
      throw new HttpException(
        `Failed to create a user`,
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.emailService.sendActivationEmail(user.email, activationCode);
    return await this.generateTokens(user, agent);
  }

  private async getRefreshToken(userId: string, agent: string): Promise<Token> {
    const _token = await this.databaseService.token.findFirst({
      where: { userId, userAgent: agent },
    });

    const token = _token?.token ?? '';
    return this.databaseService.token.upsert({
      where: { token: token },
      update: {
        token: v4(),
        exp: add(new Date(), { months: 1 }),
      },
      create: {
        token: v4(),
        exp: add(new Date(), { months: 1 }),
        userId,
        userAgent: agent,
      },
    });
  }

  private async generateTokens(user: User, agent: string): Promise<Tokens> {
    const refreshToken = await this.getRefreshToken(user.id, agent);

    const accessToken = this.jwtService.sign({
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      roles: user.roles,
      isActivated: user.isActivated,
    });

    return { accessToken, refreshToken };
  }

  private createActivationCode() {
    const code = this.jwtService.sign(
      { code: 'код активации' },
      {
        secret: this.configService.get('JWT_SECRET'),
      },
    );

    return code;
  }

  async sendActivateMail(email: string) {
    const user = await this.userService.findOne(email);
    if (user.isActivated) {
      throw new ConflictException('Профиль уже активирован');
    }
    const activationCode = this.createActivationCode();
    await this.userService.update({ email, activationCode });
    await this.emailService.sendActivationEmail(email, activationCode);
  }
}
