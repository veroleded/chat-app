import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { HttpModule } from '@nestjs/axios';
import { ChatModule } from '@chat/chat.module';
import { MessageModule } from '@message/message.module';
import { MessageService } from '@message/message.service';
import { EmailModule } from '@email/email.module';
import { WebsocketsGateway } from '@websockets/websockets.gateway';

@Module({
  imports: [
    UserModule,
    DatabaseModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    HttpModule,
    EmailModule,
    ChatModule,
    MessageModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    WebsocketsGateway,
    MessageService,
  ],
})
export class AppModule {}
