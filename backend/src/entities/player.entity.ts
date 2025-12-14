import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Session } from './session.entity';
import { Role } from './role.entity';

@Entity('players')
export class Player {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Session, session => session.players)
  @JoinColumn({ name: 'session_id' })
  session: Session;

  @Column({ name: 'session_id' })
  sessionId: string;

  @ManyToOne(() => Role, { nullable: true })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @Column({ name: 'role_id', nullable: true })
  roleId: string;

  @Column()
  slotNumber: number;

  @Column()
  nickname: string;

  @Column({ default: true })
  isAlive: boolean;

  @Column({ default: true })
  hasVoteRights: boolean;

  @Column({ unique: true })
  reconnectToken: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastSeen: Date;

  @Column({ default: false })
  isConnected: boolean;

  @Column({ type: 'jsonb', nullable: true })
  nightActionHistory: {
    day: number;
    actionType: string;
    targetId: string;
  }[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
