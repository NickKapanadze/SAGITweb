import { Controller, Post, Get, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { SessionService } from './session.service';
import { CreateSessionDto, JoinSessionDto, ConnectHostDto, ReconnectDto } from '../../dto';

@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post('create')
  async createSession(@Body() createSessionDto: CreateSessionDto) {
    try {
      const session = await this.sessionService.createSession();
      return {
        partyCode: session.partyCode,
        hostToken: session.hostToken,
        sessionId: session.id,
      };
    } catch (error) {
      throw new HttpException('Failed to create session', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('join')
  async joinSession(@Body() joinSessionDto: JoinSessionDto) {
    try {
      const session = await this.sessionService.findByPartyCode(joinSessionDto.partyCode);
      
      if (!session) {
        throw new HttpException('Session not found', HttpStatus.NOT_FOUND);
      }

      // Check if slot is available
      const existingPlayer = session.players.find(p => p.slotNumber === joinSessionDto.slotNumber);
      if (existingPlayer) {
        throw new HttpException('Slot already taken', HttpStatus.CONFLICT);
      }

      const player = await this.sessionService.addPlayer(
        session.id,
        joinSessionDto.slotNumber,
        joinSessionDto.nickname,
      );

      return {
        playerId: player.id,
        reconnectToken: player.reconnectToken,
        sessionId: session.id,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to join session', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('host/connect')
  async connectHost(@Body() connectHostDto: ConnectHostDto) {
    try {
      const session = await this.sessionService.findByPartyCode(connectHostDto.partyCode);
      
      if (!session) {
        throw new HttpException('Session not found', HttpStatus.NOT_FOUND);
      }

      return {
        sessionId: session.id,
        hostToken: session.hostToken,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to connect as host', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('reconnect')
  async reconnect(@Body() reconnectDto: ReconnectDto) {
    try {
      const player = await this.sessionService.findPlayerByReconnectToken(reconnectDto.reconnectToken);
      
      if (!player) {
        throw new HttpException('Invalid reconnect token', HttpStatus.UNAUTHORIZED);
      }

      await this.sessionService.updatePlayerConnection(player.id, true);

      return {
        playerId: player.id,
        sessionId: player.sessionId,
        role: player.role,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to reconnect', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':sessionId/state')
  async getSessionState(@Param('sessionId') sessionId: string) {
    try {
      const state = await this.sessionService.getSessionState(sessionId);
      
      if (!state) {
        throw new HttpException('Session not found', HttpStatus.NOT_FOUND);
      }

      return state;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to get session state', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
