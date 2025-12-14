import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SessionService } from '../session/session.service';
import { GameService } from '../game/game.service';
import { WebSocketEvent, ClientType, ActionType } from '../../enums';

interface ClientInfo {
  sessionId: string;
  clientType: ClientType;
  playerId?: string;
  hostToken?: string;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private clients = new Map<string, ClientInfo>();

  constructor(
    private sessionService: SessionService,
    private gameService: GameService,
  ) {}

  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    
    const clientInfo = this.clients.get(client.id);
    if (clientInfo?.playerId) {
      await this.sessionService.updatePlayerConnection(clientInfo.playerId, false);
      this.broadcastToSession(clientInfo.sessionId, WebSocketEvent.PLAYER_LEFT, {
        playerId: clientInfo.playerId,
      });
    }
    
    this.clients.delete(client.id);
  }

  @SubscribeMessage(WebSocketEvent.JOIN_SESSION)
  async handleJoinSession(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { sessionId: string; clientType: ClientType; playerId?: string; hostToken?: string },
  ) {
    try {
      const session = await this.sessionService.findById(data.sessionId);
      
      if (!session) {
        client.emit(WebSocketEvent.ERROR, { message: 'Session not found' });
        return;
      }

      // Validate host token if joining as host
      if (data.clientType === ClientType.HOST) {
        const isValidHost = await this.sessionService.validateHostToken(session.partyCode, data.hostToken || '');
        if (!isValidHost) {
          client.emit(WebSocketEvent.ERROR, { message: 'Invalid host token' });
          return;
        }
      }

      // Store client info
      this.clients.set(client.id, {
        sessionId: data.sessionId,
        clientType: data.clientType,
        playerId: data.playerId,
        hostToken: data.hostToken,
      });

      // Join session room
      client.join(data.sessionId);

      // Send current state
      const state = await this.sessionService.getSessionState(data.sessionId);
      client.emit(WebSocketEvent.SESSION_STATE_UPDATE, state);

      // Notify others
      if (data.playerId) {
        this.broadcastToSession(data.sessionId, WebSocketEvent.PLAYER_JOINED, {
          playerId: data.playerId,
        }, client.id);
      }
    } catch (error) {
      client.emit(WebSocketEvent.ERROR, { message: 'Failed to join session' });
    }
  }

  @SubscribeMessage(WebSocketEvent.START_GAME)
  async handleStartGame(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { sessionId: string },
  ) {
    try {
      const clientInfo = this.clients.get(client.id);
      if (clientInfo?.clientType !== ClientType.HOST) {
        client.emit(WebSocketEvent.ERROR, { message: 'Only host can start game' });
        return;
      }

      // Verify host token
      const session = await this.sessionService.findById(data.sessionId);
      if (!session) {
        client.emit(WebSocketEvent.ERROR, { message: 'Session not found' });
        return;
      }

      const isValidHost = await this.sessionService.validateHostToken(session.partyCode, clientInfo.hostToken || '');
      if (!isValidHost) {
        client.emit(WebSocketEvent.ERROR, { message: 'Invalid host credentials' });
        return;
      }

      await this.gameService.startGame(data.sessionId);
      
      const state = await this.sessionService.getSessionState(data.sessionId);
      this.broadcastToSession(data.sessionId, WebSocketEvent.SESSION_STATE_UPDATE, state);

      // Send role assignments to players
      const session = await this.sessionService.findById(data.sessionId);
      if (session) {
        for (const player of session.players) {
          const playerClients = this.getClientsByPlayerId(player.id);
          playerClients.forEach(clientId => {
            this.server.to(clientId).emit(WebSocketEvent.ROLE_ASSIGNED, {
              role: player.role,
              teamMembers: this.getTeamMembers(session, player),
            });
          });
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to start game';
      client.emit(WebSocketEvent.ERROR, { message: errorMessage });
    }
  }

  @SubscribeMessage(WebSocketEvent.SUBMIT_VOTE)
  async handleSubmitVote(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { targetId: string | null },
  ) {
    try {
      const clientInfo = this.clients.get(client.id);
      if (!clientInfo?.playerId) {
        client.emit(WebSocketEvent.ERROR, { message: 'Player ID not found' });
        return;
      }

      const session = await this.sessionService.findById(clientInfo.sessionId);
      if (!session) {
        client.emit(WebSocketEvent.ERROR, { message: 'Session not found' });
        return;
      }

      await this.gameService.submitVote(
        clientInfo.playerId,
        data.targetId,
        clientInfo.sessionId,
        session.currentDay,
      );

      // Broadcast vote progress based on visibility mode
      const votes = await this.gameService.getVotes(clientInfo.sessionId, session.currentDay);
      
      if (session.config.votingMode === 'VISIBLE') {
        // Send full vote data to everyone
        this.broadcastToSession(clientInfo.sessionId, WebSocketEvent.VOTE_PROGRESS, {
          votes: votes.map(v => ({
            voterId: v.voterId,
            targetId: v.targetId,
          })),
        });
      }

      // Always send full data to host
      const hostClients = this.getHostClients(clientInfo.sessionId);
      hostClients.forEach(clientId => {
        this.server.to(clientId).emit(WebSocketEvent.VOTE_PROGRESS_HOST, {
          votes: votes.map(v => ({
            voterId: v.voterId,
            voterName: v.voter.nickname,
            targetId: v.targetId,
            targetName: v.target?.nickname,
          })),
        });
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit vote';
      client.emit(WebSocketEvent.ERROR, { message: errorMessage });
    }
  }

  @SubscribeMessage(WebSocketEvent.SUBMIT_NIGHT_ACTION)
  async handleSubmitNightAction(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { actionType: string; targetId: string | null },
  ) {
    try {
      const clientInfo = this.clients.get(client.id);
      if (!clientInfo?.playerId) {
        client.emit(WebSocketEvent.ERROR, { message: 'Player ID not found' });
        return;
      }

      const session = await this.sessionService.findById(clientInfo.sessionId);
      if (!session) {
        client.emit(WebSocketEvent.ERROR, { message: 'Session not found' });
        return;
      }

      await this.gameService.submitNightAction(
        clientInfo.playerId,
        data.actionType as ActionType,
        data.targetId,
        clientInfo.sessionId,
        session.currentDay,
      );

      client.emit(WebSocketEvent.SESSION_STATE_UPDATE, { nightActionSubmitted: true });
    } catch (error) {
      const errorMessage = error instanceof Error && error.message.includes('not found') 
        ? error.message 
        : 'Failed to submit night action';
      client.emit(WebSocketEvent.ERROR, { message: errorMessage });
    }
  }

  @SubscribeMessage(WebSocketEvent.NEXT_PHASE)
  async handleNextPhase(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { sessionId: string },
  ) {
    try {
      const clientInfo = this.clients.get(client.id);
      if (clientInfo?.clientType !== ClientType.HOST) {
        client.emit(WebSocketEvent.ERROR, { message: 'Only host can advance phase' });
        return;
      }

      const nextState = await this.gameService.transitionToNextPhase(data.sessionId);
      
      const state = await this.sessionService.getSessionState(data.sessionId);
      this.broadcastToSession(data.sessionId, WebSocketEvent.SESSION_STATE_UPDATE, state);

      // Check if game ended
      const session = await this.sessionService.findById(data.sessionId);
      if (session) {
        const winner = await this.gameService.checkWinCondition(session);
        if (winner) {
          this.broadcastToSession(data.sessionId, WebSocketEvent.GAME_ENDED, { winner });
        }
      }
    } catch (error) {
      client.emit(WebSocketEvent.ERROR, { message: 'Failed to advance phase' });
    }
  }

  @SubscribeMessage(WebSocketEvent.ASSIGN_FOUL)
  async handleAssignFoul(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { sessionId: string; playerId: string; reason?: string },
  ) {
    try {
      const clientInfo = this.clients.get(client.id);
      if (clientInfo?.clientType !== ClientType.HOST) {
        client.emit(WebSocketEvent.ERROR, { message: 'Only host can assign fouls' });
        return;
      }

      await this.gameService.assignFoul(data.sessionId, data.playerId, data.reason);
      
      const state = await this.sessionService.getSessionState(data.sessionId);
      this.broadcastToSession(data.sessionId, WebSocketEvent.SESSION_STATE_UPDATE, state);
      
      this.broadcastToSession(data.sessionId, WebSocketEvent.FOUL_ASSIGNED, {
        playerId: data.playerId,
        reason: data.reason,
      });
    } catch (error) {
      client.emit(WebSocketEvent.ERROR, { message: 'Failed to assign foul' });
    }
  }

  @SubscribeMessage(WebSocketEvent.HEARTBEAT)
  async handleHeartbeat(
    @ConnectedSocket() client: Socket,
  ) {
    const clientInfo = this.clients.get(client.id);
    if (clientInfo?.playerId) {
      await this.sessionService.updatePlayerConnection(clientInfo.playerId, true);
    }
  }

  private broadcastToSession(sessionId: string, event: WebSocketEvent, data: any, excludeClient?: string) {
    if (excludeClient) {
      this.server.to(sessionId).except(excludeClient).emit(event, data);
    } else {
      this.server.to(sessionId).emit(event, data);
    }
  }

  private getClientsByPlayerId(playerId: string): string[] {
    const clientIds: string[] = [];
    this.clients.forEach((info, clientId) => {
      if (info.playerId === playerId) {
        clientIds.push(clientId);
      }
    });
    return clientIds;
  }

  private getHostClients(sessionId: string): string[] {
    const clientIds: string[] = [];
    this.clients.forEach((info, clientId) => {
      if (info.sessionId === sessionId && info.clientType === ClientType.HOST) {
        clientIds.push(clientId);
      }
    });
    return clientIds;
  }

  private getTeamMembers(session: any, player: any): any[] {
    if (!player.role?.knowsTeamMembers) {
      return [];
    }

    return session.players
      .filter((p: any) => p.role?.team === player.role?.team && p.id !== player.id)
      .map((p: any) => ({
        id: p.id,
        nickname: p.nickname,
        slotNumber: p.slotNumber,
      }));
  }
}
