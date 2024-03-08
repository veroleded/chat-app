import { MessageService } from '@message/message.service';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { SendMessageDto } from './dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  serverClient: false,
  namespace: 'chat',
})
export class WebsocketsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly messageService: MessageService) {}

  @WebSocketServer() server: Server;

  @SubscribeMessage('sendMessage')
  async handleSendMessage(@MessageBody() payload: SendMessageDto) {
    const message = await this.messageService.create(payload);
    return message;
  }

  afterInit(server: Server) {
    console.log(`websocket init ${server}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`disconnected: ${client.id}`);
  }
}
