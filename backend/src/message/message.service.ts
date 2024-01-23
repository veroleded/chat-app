import { ChatService } from '@chat/chat.service';
import { DatabaseService } from '@database/database.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { SendMessageDto } from '@websockets/dto';

@Injectable()
export class MessageService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly chatService: ChatService,
  ) {}

  async create(dto: SendMessageDto) {
    const chat = await this.chatService.getOne(dto.chatId, dto.userId);
    if (!chat) {
      throw new ForbiddenException();
    }
    const message = await this.databaseService.message.create({
      data: { ...dto },
    });

    return message;
  }
}
