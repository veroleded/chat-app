import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { UserModule } from '@user/user.module';

@Module({
  controllers: [ChatController],
  providers: [ChatService],
  imports: [UserModule],
  exports: [ChatService],
})
export class ChatModule {}
