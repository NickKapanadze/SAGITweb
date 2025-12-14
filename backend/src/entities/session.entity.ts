import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { GameState, VotingMode } from '../enums';
import { Player } from './player.entity';
import { Vote } from './vote.entity';
import { NightAction } from './night-action.entity';
import { Foul } from './foul.entity';

@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 6 })
  partyCode: string;

  @Column({
    type: 'enum',
    enum: GameState,
    default: GameState.LOBBY,
  })
  state: GameState;

  @Column({ type: 'jsonb', nullable: true })
  config: {
    maxPlayers: number;
    timers: {
      discussion: number;
      speeches: number;
      voting: number;
      nightPhase: number;
    };
    roleCounts: {
      [roleName: string]: number;
    };
    abilityLimits: {
      doctorHealsPerPlayer?: number;
      doctorTotalHeals?: number;
      serialKillerTotalKills?: number;
    };
    votingMode: VotingMode;
    allowMidGameJoin: boolean;
    autoKickFouls: number;
    canMafiaTargetMafia: boolean;
  };

  @Column({ default: 1 })
  currentDay: number;

  @Column({ default: 0 })
  currentSpeaker: number;

  @Column({ type: 'jsonb', nullable: true })
  speakingOrder: number[];

  @Column({ type: 'timestamp', nullable: true })
  phaseStartTime: Date;

  @Column({ nullable: true })
  hostToken: string;

  @OneToMany(() => Player, player => player.session)
  players: Player[];

  @OneToMany(() => Vote, vote => vote.session)
  votes: Vote[];

  @OneToMany(() => NightAction, action => action.session)
  nightActions: NightAction[];

  @OneToMany(() => Foul, foul => foul.session)
  fouls: Foul[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
