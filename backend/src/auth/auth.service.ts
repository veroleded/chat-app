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
import { EmailService } from '@email/email.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly databaseService: DatabaseService,
    private readonly emailService: EmailService,
  ) {}

  async register(dto: RegistrationUserDto, agent: string) {
    const userExist: User = await this.userService
      .findOne(dto.email)
      .catch((error) => {
        this.logger.error(error);
        return null;
      });

    const code = v4();

    if (userExist) {
      if (userExist.isActivated) {
        throw new ConflictException(
          'A user with this email address already exists',
        );
      }

      const user = await this.databaseService.user.update({
        where: { id: userExist.id },
        data: { activationCode: code },
      });

      await this.emailService.sendActivationEmail(userExist.email, code);
      return await this.generateTokens(user, agent);
    }
    const user = await this.userService
      .create({ activationCode: code, ...dto })
      .catch((err) => {
        this.logger.error(err);
        return null;
      });
    console.log(code);
    console.log(dto);
    console.log(user);

    if (!user) {
      throw new BadRequestException(
        `Failed to register users with the data ${JSON.stringify(dto)}`,
      );
    }

    await this.emailService.sendActivationEmail(user.email, code);
    const tokens = await this.generateTokens(user, agent);

    return tokens;
  }

  async login(dto: LoginDto, agent: string): Promise<Tokens> {
    const user: User = await this.userService
      .findOne(dto.email, true)
      .catch((error) => {
        this.logger.error(error);
        return null;
      });

    if (!user || !(await argon2.verify(user.password, dto.password))) {
      throw new UnauthorizedException('Invalid login or password');
    }

    return await this.generateTokens(user, agent);
  }

  // verifyAccessToken(accessToken: string) {
  //   return this.jwtService.verify(accessToken);
  // }

  async deleteRefreshToken(token: string) {
    return this.databaseService.token.delete({ where: { token } });
  }

  async refreshTokens(refreshToken: string, agent: string): Promise<Tokens> {
    const token = await this.databaseService.token.delete({
      where: { token: refreshToken },
    });

    if (!token || new Date(token.exp) < new Date()) {
      throw new UnauthorizedException();
    }

    const user = await this.userService.findOne(token.userId);

    const tokens = await this.generateTokens(user, agent);
    return tokens;
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

    const user = await this.userService
      .create({ email, provider })
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
      name: user.name,
      roles: user.roles,
    });

    return { accessToken, refreshToken };
  }
}
