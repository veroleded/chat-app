import { DatabaseService } from '@database/database.service';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { genSaltSync, hashSync } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}

  create(user: Partial<User>) {
    const hashedPassword = this.hashPassword(user.password);
    return this.databaseService.user.create({
      data: {
        email: user.email,
        password: hashedPassword,
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

  delete(id: string) {
    return this.databaseService.user.delete({ where: { id: id } });
  }

  private hashPassword(password: string) {
    return hashSync(password, genSaltSync(10));
  }
}
