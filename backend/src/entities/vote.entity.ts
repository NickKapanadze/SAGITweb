import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Session } from './session.entity';
import { Player } from './player.entity';
import { VotingMode } from '../enums';

@Entity('votes')
export class Vote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Session, session => session.votes)
  @JoinColumn({ name: 'session_id' })
  session: Session;

  @Column({ name: 'session_id' })
  sessionId: string;

  @Column()
  phaseId: string;

  @ManyToOne(() => Player)
  @JoinColumn({ name: 'voter_id' })
  voter: Player;

  @Column({ name: 'voter_id' })
  voterId: string;

  @ManyToOne(() => Player, { nullable: true })
  @JoinColumn({ name: 'target_id' })
  target: Player;

  @Column({ name: 'target_id', nullable: true })
  targetId: string;

  @Column({
    type: 'enum',
    enum: VotingMode,
  })
  visibilityMode: VotingMode;

  @CreateDateColumn()
  createdAt: Date;
}
