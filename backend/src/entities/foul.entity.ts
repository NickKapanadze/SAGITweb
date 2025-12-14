import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Session } from './session.entity';
import { Player } from './player.entity';

@Entity('fouls')
export class Foul {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Session, session => session.fouls)
  @JoinColumn({ name: 'session_id' })
  session: Session;

  @Column({ name: 'session_id' })
  sessionId: string;

  @ManyToOne(() => Player)
  @JoinColumn({ name: 'player_id' })
  player: Player;

  @Column({ name: 'player_id' })
  playerId: string;

  @Column({ type: 'text', nullable: true })
  reason: string;

  @CreateDateColumn()
  timestamp: Date;
}
