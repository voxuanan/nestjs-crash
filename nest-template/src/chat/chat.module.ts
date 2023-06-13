import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Message from './entity/message.entity';
import { ChatGateway } from './chat.gateway';
import { AuthenticationModule } from 'src/authentication/authentication.module';

@Module({
  imports: [AuthenticationModule, TypeOrmModule.forFeature([Message])],
  controllers: [],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
