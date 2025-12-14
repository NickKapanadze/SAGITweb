import { Module } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';
import { SessionModule } from '../session/session.module';
import { GameModule } from '../game/game.module';

@Module({
  imports: [SessionModule, GameModule],
  providers: [WebsocketGateway],
})
export class WebsocketModule {}
