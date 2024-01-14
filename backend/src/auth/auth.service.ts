import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto, RegistrationUserDto } from './dto';
import { UserService } from '@user/user.service';
import { Tokens } from './interfaces';
import { JwtService } from '@nestjs/jwt';
import { Token, User } from '@prisma/client';
import { DatabaseService } from '@database/database.service';
import { v4 } from 'uuid';
import { add } from 'date-fns';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly databaseService: DatabaseService,
  ) {}

  async register(dto: RegistrationUserDto) {
    const user: User = await this.userService
      .findOne(dto.email)
      .catch((error) => {
        this.logger.error(error);
        return null;
      });
    if (user) {
      throw new ConflictException(
        'A user with this email address already exists',
      );
    }
    return this.userService.create(dto).catch((err) => {
      this.logger.error(err);
      return null;
    });
  }

  async login(dto: LoginDto, agent: string): Promise<Tokens> {
    const user: User = await this.userService
      .findOne(dto.email)
      .catch((error) => {
        this.logger.error(error);
        return null;
      });

    if (!user || !(await argon2.verify(user.password, dto.password))) {
      throw new UnauthorizedException('Invalid login or password');
    }

    return await this.generateTokens(user, agent);
  }

  async deleteRefreshToken(token: string) {
    return this.databaseService.token.delete({ where: { token } });
  }

  async refreshTokens(refreshToken: string, agent: string): Promise<Tokens> {
    const token = await this.databaseService.token.findUnique({
      where: { token: refreshToken },
    });

    if (!token) {
      throw new UnauthorizedException();
    }

    await this.databaseService.token.delete({
      where: { token: token.token },
    });

    if (new Date(token.exp) < new Date()) {
      throw new UnauthorizedException();
    }

    const user = await this.databaseService.user.findUnique({
      where: { id: token.userId },
    });

    const tokens = await this.generateTokens(user, agent);
    return tokens;
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
    const accessToken =
      'Bearer ' +
      this.jwtService.sign({
        id: user.id,
        email: user.email,
        name: user.name,
        roles: user.roles,
      });

    const refreshToken = await this.getRefreshToken(user.id, agent);

    return { accessToken, refreshToken };
  }
}
