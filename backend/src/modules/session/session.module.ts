import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session, Player, Role, Vote, NightAction, Foul } from '../../entities';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Session, Player, Role, Vote, NightAction, Foul]),
  ],
  controllers: [SessionController],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}
