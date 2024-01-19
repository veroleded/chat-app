import { JwtPayload } from '@auth/interfaces';
import { convertToSecondsUtil } from '@common/utils';
import { DatabaseService } from '@database/database.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Provider, Roles, User } from '@prisma/client';
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
        provider: user.provider ?? Provider.ORIGIN,
        activationCode: user.activationCode,
      },
    });
  }

  async updateOnProvider(user: Partial<User>) {
    const hashedPassword = user?.password
      ? await this.hashPassword(user.password)
      : null;

    const updatedUser = await this.databaseService.user.update({
      where: { email: user.email },
      data: {
        provider: user?.provider ?? undefined,
        roles: user?.roles ?? undefined,
        password: hashedPassword ?? undefined,
      },
    });

    await Promise.all([
      this.cacheManager.set(updatedUser.id, updatedUser),
      this.cacheManager.set(updatedUser.email, updatedUser),
    ]);

    return updatedUser;
  }

  async findOne(uniqueColumn: string, isReset = false) {
    if (isReset) {
      await this.cacheManager.del(uniqueColumn);
    }

    const userInCache = await this.cacheManager.get<User>(uniqueColumn);

    if (!userInCache) {
      const user = await this.databaseService.user.findFirst({
        where: {
          OR: [
            { id: uniqueColumn },
            { email: uniqueColumn },
            { activationCode: uniqueColumn },
          ],
        },
      });
      if (!user) {
        return null;
      }

      await this.cacheManager.set(
        uniqueColumn,
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
