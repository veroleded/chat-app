import { JwtPayload } from '@auth/interfaces';
import { CurrentUser } from '@common/decorators';
import {
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '@user/user.service';
import { ChatService } from './chat.service';

@Controller('chats')
export class ChatController {
  constructor(
    private readonly userService: UserService,
    private readonly chatService: ChatService,
  ) {}

  @Get()
  async getAllChatsWithLatestMessages(@CurrentUser() user: JwtPayload) {
    const userChatsWithLastMessage = await this.chatService.getAll(user.id);
    if (!userChatsWithLastMessage) {
      throw new UnauthorizedException();
    }

    return userChatsWithLastMessage.chats;
  }

  @Get(':id')
  async getOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const chat = await this.chatService.getOne(id, user.id);

    if (!chat) {
      throw new NotFoundException('Chat is not found');
    }
    return chat;
  }

  @Post()
  async create(
    @CurrentUser() user: JwtPayload,
    @Query('join') joinedUserId: string,
  ) {
    const chat = await this.chatService.create([user.id, joinedUserId]);

    if (!chat) {
      throw new InternalServerErrorException();
    }
    return chat;
  }
}
