import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Dog } from './Dog';

@Entity('medications')
export class Medication {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  dogId: string;

  @ManyToOne(() => Dog, (dog) => dog.medications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'dogId' })
  dog: Dog;

  @Column({ type: 'varchar' })
  medicationName: string;

  @Column({ type: 'varchar' })
  dosage: string;

  @Column({ type: 'varchar' })
  frequency: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @Column({ type: 'varchar', nullable: true })
  prescribingVet: string;

  @Column({ type: 'text', nullable: true })
  purpose: string;

  @Column({ type: 'text', nullable: true })
  sideEffects: string;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @Column({ type: 'date', nullable: true })
  refillReminderDate: Date;

  @CreateDateColumn()
  createdAt: Date;
}