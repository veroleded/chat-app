import { JwtPayload } from '@auth/interfaces';
import { DatabaseService } from '@database/database.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { Roles, User } from '@prisma/client';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(user: Partial<User>) {
    const hashedPassword = this.hashPassword(user.password);
    return this.databaseService.user.create({
      data: {
        email: user.email,
        password: await hashedPassword,
        name: user.name,
        roles: ['USER'],
      },
    });
  }

  findOne(idOrEmail: string) {
    return this.databaseService.user.findFirst({
      where: {
        OR: [{ id: idOrEmail }, { email: idOrEmail }],
      },
    });
  }

  async delete(id: string, user: JwtPayload) {
    if (user.id !== id && !user.roles.includes(Roles.ADMIN)) {
      throw new ForbiddenException();
    }

    const deletedUser = await this.databaseService.user.delete({
      where: { id: id },
    });

    return deletedUser;
  }

  private async hashPassword(password: string) {
    const hash = await argon2.hash(password);
    return hash;
  }
}
