import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { Team } from '../enums';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({
    type: 'enum',
    enum: Team,
  })
  team: Team;

  @Column({ type: 'jsonb' })
  abilities: {
    kill?: {
      enabled: boolean;
      limit?: number;
    };
    heal?: {
      enabled: boolean;
      limitPerPlayer?: number;
      totalLimit?: number;
    };
    check?: {
      enabled: boolean;
      canCheckSameTwice?: boolean;
    };
  };

  @Column({ default: true })
  canVote: boolean;

  @Column({ default: 0 })
  nightOrder: number;

  @Column({ default: false })
  isCustom: boolean;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: false })
  knowsTeamMembers: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
