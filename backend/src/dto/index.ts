import { IsString, IsOptional, IsNumber, IsEnum, IsBoolean, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { VotingMode } from '../enums';

export class CreateSessionDto {
  @IsOptional()
  @IsObject()
  config?: {
    maxPlayers?: number;
    votingMode?: VotingMode;
    allowMidGameJoin?: boolean;
    autoKickFouls?: number;
  };
}

export class JoinSessionDto {
  @IsString()
  partyCode: string;

  @IsNumber()
  slotNumber: number;

  @IsString()
  nickname: string;
}

export class ConnectHostDto {
  @IsString()
  partyCode: string;
}

export class ReconnectDto {
  @IsString()
  reconnectToken: string;
}

export class SubmitVoteDto {
  @IsString()
  @IsOptional()
  targetId?: string;
}

export class SubmitNightActionDto {
  @IsString()
  actionType: string;

  @IsString()
  @IsOptional()
  targetId?: string;
}

export class AssignFoulDto {
  @IsString()
  playerId: string;

  @IsString()
  @IsOptional()
  reason?: string;
}

export class KickPlayerDto {
  @IsString()
  playerId: string;
}

export class UpdateConfigDto {
  @IsOptional()
  @IsNumber()
  maxPlayers?: number;

  @IsOptional()
  @IsObject()
  timers?: {
    discussion?: number;
    speeches?: number;
    voting?: number;
    nightPhase?: number;
  };

  @IsOptional()
  @IsObject()
  roleCounts?: {
    [roleName: string]: number;
  };

  @IsOptional()
  @IsEnum(VotingMode)
  votingMode?: VotingMode;

  @IsOptional()
  @IsBoolean()
  allowMidGameJoin?: boolean;

  @IsOptional()
  @IsNumber()
  autoKickFouls?: number;
}
