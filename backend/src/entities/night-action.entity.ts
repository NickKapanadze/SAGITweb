import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Session } from './session.entity';
import { Player } from './player.entity';
import { ActionType } from '../enums';

@Entity('night_actions')
export class NightAction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Session, session => session.nightActions)
  @JoinColumn({ name: 'session_id' })
  session: Session;

  @Column({ name: 'session_id' })
  sessionId: string;

  @ManyToOne(() => Player)
  @JoinColumn({ name: 'actor_id' })
  actor: Player;

  @Column({ name: 'actor_id' })
  actorId: string;

  @Column({
    type: 'enum',
    enum: ActionType,
  })
  actionType: ActionType;

  @ManyToOne(() => Player, { nullable: true })
  @JoinColumn({ name: 'target_id' })
  target: Player;

  @Column({ name: 'target_id', nullable: true })
  targetId: string;

  @Column({ default: false })
  resolved: boolean;

  @Column()
  day: number;

  @Column({ type: 'jsonb', nullable: true })
  result: {
    success?: boolean;
    blocked?: boolean;
    checkResult?: string;
  };

  @CreateDateColumn()
  createdAt: Date;
}
