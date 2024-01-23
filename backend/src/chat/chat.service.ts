import { DatabaseService } from '@database/database.service';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
} from '@nestjs/common';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  constructor(private readonly databaseService: DatabaseService) {}

  async getAll(userId: string) {
    const userChatsWithLastMessage = await this.databaseService.user.findUnique(
      {
        where: { id: userId },
        include: {
          chats: {
            include: {
              messages: {
                orderBy: { createdAt: 'desc' },
                take: 1,
              },
              users: {
                select: { id: true, name: true },
              },
            },
          },
        },
      },
    );

    return userChatsWithLastMessage;
  }

  async getOne(id: string, userId: string) {
    const chat = await this.databaseService.chat
      .findUnique({
        where: {
          id,
          users: {
            some: {
              id: userId,
            },
          },
        },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
          },
          users: { select: { id: true, name: true } },
        },
      })
      .catch((err) => {
        this.logger.error(err);
        return null;
      });

    return chat;
  }

  async create(usersId: string[]) {
    const chatExist = await this.databaseService.chat.findFirst({
      where: {
        AND: [
          { users: { some: { id: usersId[0] } } },
          { users: { some: { id: usersId[1] } } },
        ],
      },
    });

    if (chatExist) {
      throw new ConflictException('Chat already exist');
    }

    const areAllUsersActivated = await this.databaseService.user.findMany({
      where: {
        id: { in: usersId },
        isActivated: true,
      },
    });
    if (areAllUsersActivated.length !== usersId.length) {
      throw new BadRequestException('Unable to create a chat');
    }
    const chat = await this.databaseService.chat
      .create({
        data: {
          users: {
            connect: [{ id: usersId[0] }, { id: usersId[1] }],
          },
        },
      })
      .catch((err) => {
        this.logger.error(err);
        return null;
      });

    return chat;
  }
}
