import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session, Player, Role, Vote, NightAction, Foul } from '../../entities';
import { GameService } from './game.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Session, Player, Role, Vote, NightAction, Foul]),
  ],
  providers: [GameService],
  exports: [GameService],
})
export class GameModule {}
