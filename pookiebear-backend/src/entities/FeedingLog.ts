import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Dog } from './Dog';

export enum AppetiteLevel {
  NONE = 'none',
  POOR = 'poor',
  NORMAL = 'normal',
  ENTHUSIASTIC = 'enthusiastic',
}

@Entity('feeding_logs')
export class FeedingLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  dogId: string;

  @ManyToOne(() => Dog, (dog) => dog.feedingLogs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'dogId' })
  dog: Dog;

  @Column({ type: 'uuid', nullable: true })
  feedingScheduleId: string;

  @Column({ type: 'timestamp' })
  fedAt: Date;

  @Column({ type: 'float' })
  portionCups: number;

  @Column({ type: 'varchar' })
  foodType: string;

  @Column({ type: 'int', nullable: true })
  calories: number;

  @Column({ type: 'enum', enum: AppetiteLevel })
  appetiteLevel: AppetiteLevel;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;
}