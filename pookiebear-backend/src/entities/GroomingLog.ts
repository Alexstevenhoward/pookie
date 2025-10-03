import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Dog } from './Dog';

export enum GroomingTaskType {
  BATH = 'bath',
  NAIL_TRIM = 'nail_trim',
  EAR_CLEANING = 'ear_cleaning',
  TEETH_BRUSHING = 'teeth_brushing',
  HAIRCUT = 'haircut',
  ANAL_GLANDS = 'anal_glands',
}

export enum GroomingLocation {
  HOME = 'home',
  PROFESSIONAL = 'professional',
  VET = 'vet',
}

@Entity('grooming_logs')
export class GroomingLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  dogId: string;

  @ManyToOne(() => Dog, (dog) => dog.groomingLogs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'dogId' })
  dog: Dog;

  @Column({ type: 'uuid', nullable: true })
  groomingTaskId: string;

  @Column({ type: 'enum', enum: GroomingTaskType })
  taskType: GroomingTaskType;

  @Column({ type: 'timestamp' })
  completedDate: Date;

  @Column({ type: 'enum', enum: GroomingLocation })
  location: GroomingLocation;

  @Column({ type: 'varchar', nullable: true })
  groomerName: string;

  @Column({ type: 'float', nullable: true })
  cost: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'simple-array', nullable: true })
  photos: string[];

  @CreateDateColumn()
  createdAt: Date;
}