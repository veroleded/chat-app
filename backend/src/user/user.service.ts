import { JwtPayload } from '@auth/interfaces';
import { convertToSecondsUtil } from '@common/utils';
import { DatabaseService } from '@database/database.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Roles, User } from '@prisma/client';
import * as argon2 from 'argon2';
import { Cache } from 'cache-manager';

@Injectable()
export class UserService {
  constructor(
    private readonly databaseService: DatabaseService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService,
  ) {}

  async create(user: Partial<User>) {
    const hashedPassword = user?.password
      ? this.hashPassword(user.password)
      : null;
    return this.databaseService.user.create({
      data: {
        email: user.email,
        password: await hashedPassword,
        name: user.name,
        roles: ['USER'],
      },
    });
  }

  async findOne(idOrEmail: string, isReset = false) {
    if (isReset) {
      await this.cacheManager.del(idOrEmail);
    }

    const userInCache = await this.cacheManager.get<User>(idOrEmail);

    if (!userInCache) {
      const user = this.databaseService.user.findFirst({
        where: {
          OR: [{ id: idOrEmail }, { email: idOrEmail }],
        },
      });
      if (!user) {
        return null;
      }
      await this.cacheManager.set(
        idOrEmail,
        user,
        convertToSecondsUtil(this.configService.get('JWT_EXP')),
      );
      return user;
    }

    return userInCache;
  }

  async delete(id: string, user: JwtPayload) {
    if (user.id !== id && !user.roles.includes(Roles.ADMIN)) {
      throw new ForbiddenException();
    }

    const deletedUser = await this.databaseService.user.delete({
      where: { id: id },
    });

    await Promise.all([
      this.cacheManager.del(id),
      this.cacheManager.del(user.email),
    ]);

    return deletedUser;
  }

  private async hashPassword(password: string) {
    const hash = await argon2.hash(password);
    return hash;
  }
}
