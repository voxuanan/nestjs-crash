import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway()
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  afterInit(socket: Socket) {}

  async handleConnection(socket: Socket) {
    await this.chatService.getUserFromSocket(socket);
  }

  handleDisconnect(socket: Socket) {}

  @SubscribeMessage('send_message')
  async listenForMessages(
    @MessageBody() content: string,
    @ConnectedSocket() socket: Socket,
  ) {
    const author = await this.chatService.getUserFromSocket(socket);
    const message = await this.chatService.saveMessage(content, author);

    this.server.sockets.emit('receive_message', message);
  }

  @SubscribeMessage('request_all_messages')
  async requestAllMessages(@ConnectedSocket() socket: Socket) {
    await this.chatService.getUserFromSocket(socket);
    const messages = await this.chatService.getAllMessages();

    socket.emit('send_all_messages', messages);
  }
}
