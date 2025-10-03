import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Dog } from './Dog';
import { User } from './User';

export enum ActivityType {
  WALK = 'walk',
  PLAYTIME = 'playtime',
  TRAINING = 'training',
  SWIMMING = 'swimming',
  FETCH = 'fetch',
  PARK_VISIT = 'park_visit',
  DAYCARE = 'daycare',
  HIKING = 'hiking',
}

export enum ActivityIntensity {
  LOW = 'low',
  MODERATE = 'moderate',
  HIGH = 'high',
}

@Entity('activities')
export class Activity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  dogId: string;

  @ManyToOne(() => Dog, (dog) => dog.activities, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'dogId' })
  dog: Dog;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'enum', enum: ActivityType })
  activityType: ActivityType;

  @Column({ type: 'timestamp' })
  startTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  endTime: Date;

  @Column({ type: 'int', nullable: true })
  durationSeconds: number;

  @Column({ type: 'float', nullable: true })
  distanceMeters: number;

  @Column({ type: 'float', nullable: true })
  averagePace: number;

  @Column({ type: 'text', nullable: true })
  routePolyline: string;

  @Column({ type: 'jsonb', nullable: true })
  routeCoordinates: object[];

  @Column({ type: 'int', nullable: true })
  caloriesBurned: number;

  @Column({ type: 'int', nullable: true })
  steps: number;

  @Column({ type: 'jsonb', nullable: true })
  pauses: object[];

  @Column({ type: 'jsonb', nullable: true })
  weatherConditions: object;

  @Column({ type: 'float', nullable: true })
  temperatureFahrenheit: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'simple-array', nullable: true })
  photos: string[];

  @Column({ type: 'enum', enum: ActivityIntensity, nullable: true })
  intensity: ActivityIntensity;

  @Column({ type: 'varchar', nullable: true })
  location: string;

  @Column({ type: 'boolean', default: true })
  synced: boolean;

  @CreateDateColumn()
  createdAt: Date;
}