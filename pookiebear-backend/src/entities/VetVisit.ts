import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Dog } from './Dog';

export enum VisitType {
  WELLNESS = 'wellness',
  SICK = 'sick',
  EMERGENCY = 'emergency',
  SURGERY = 'surgery',
  DENTAL = 'dental',
}

@Entity('vet_visits')
export class VetVisit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  dogId: string;

  @ManyToOne(() => Dog, (dog) => dog.vetVisits, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'dogId' })
  dog: Dog;

  @Column({ type: 'date' })
  visitDate: Date;

  @Column({ type: 'uuid', nullable: true })
  vetClinicId: string;

  @Column({ type: 'enum', enum: VisitType })
  visitType: VisitType;

  @Column({ type: 'text', nullable: true })
  reason: string;

  @Column({ type: 'text', nullable: true })
  diagnosis: string;

  @Column({ type: 'jsonb', nullable: true })
  prescribedMedications: object[];

  @Column({ type: 'simple-array', nullable: true })
  proceduresPerformed: string[];

  @Column({ type: 'jsonb', nullable: true })
  testResults: object[];

  @Column({ type: 'text', nullable: true })
  vetNotes: string;

  @Column({ type: 'boolean', default: false })
  followUpRequired: boolean;

  @Column({ type: 'date', nullable: true })
  followUpDate: Date;

  @Column({ type: 'float', nullable: true })
  cost: number;

  @Column({ type: 'varchar', nullable: true })
  invoicePhotoUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}