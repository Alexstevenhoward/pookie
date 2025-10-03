import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './User';
import { VetVisit } from './VetVisit';
import { Vaccination } from './Vaccination';
import { Medication } from './Medication';
import { Allergy } from './Allergy';
import { Activity } from './Activity';
import { FeedingLog } from './FeedingLog';
import { GroomingLog } from './GroomingLog';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

export enum CoatType {
  SHORT = 'short',
  MEDIUM = 'medium',
  LONG = 'long',
  CURLY = 'curly',
  WIRE = 'wire',
}

export enum EnergyLevel {
  LOW = 'low',
  MODERATE = 'moderate',
  HIGH = 'high',
  VERY_HIGH = 'very_high',
}

@Entity('dogs')
export class Dog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  ownerId: string;

  @ManyToOne(() => User, (user) => user.dogs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  breed: string;

  @Column({ type: 'uuid', nullable: true })
  breedId: string;

  @Column({ type: 'boolean', default: false })
  mixedBreed: boolean;

  @Column({ type: 'simple-array', nullable: true })
  secondaryBreeds: string[];

  @Column({ type: 'date' })
  dateOfBirth: Date;

  @Column({ type: 'enum', enum: Gender })
  gender: Gender;

  @Column({ type: 'boolean', default: false })
  neuteredSpayed: boolean;

  @Column({ type: 'float' })
  weightLbs: number;

  @Column({ type: 'varchar', nullable: true })
  microchipId: string;

  @Column({ type: 'varchar', nullable: true })
  microchipRegistry: string;

  @Column({ type: 'varchar', nullable: true })
  profilePhotoUrl: string;

  @Column({ type: 'simple-array', nullable: true })
  additionalPhotos: string[];

  @Column({ type: 'varchar', nullable: true })
  coatColor: string;

  @Column({ type: 'enum', enum: CoatType, nullable: true })
  coatType: CoatType;

  @Column({ type: 'enum', enum: EnergyLevel, nullable: true })
  energyLevel: EnergyLevel;

  @Column({ type: 'simple-array', nullable: true })
  temperamentTags: string[];

  @Column({ type: 'text', nullable: true })
  specialNeeds: string;

  @Column({ type: 'boolean', default: false })
  archived: boolean;

  @Column({ type: 'timestamp', nullable: true })
  archivedDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => VetVisit, (visit) => visit.dog)
  vetVisits: VetVisit[];

  @OneToMany(() => Vaccination, (vaccination) => vaccination.dog)
  vaccinations: Vaccination[];

  @OneToMany(() => Medication, (medication) => medication.dog)
  medications: Medication[];

  @OneToMany(() => Allergy, (allergy) => allergy.dog)
  allergies: Allergy[];

  @OneToMany(() => Activity, (activity) => activity.dog)
  activities: Activity[];

  @OneToMany(() => FeedingLog, (feeding) => feeding.dog)
  feedingLogs: FeedingLog[];

  @OneToMany(() => GroomingLog, (grooming) => grooming.dog)
  groomingLogs: GroomingLog[];
}