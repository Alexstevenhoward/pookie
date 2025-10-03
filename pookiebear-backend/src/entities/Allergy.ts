import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Dog } from './Dog';

export enum AllergyType {
  FOOD = 'food',
  ENVIRONMENTAL = 'environmental',
  MEDICATION = 'medication',
  CONTACT = 'contact',
}

export enum AllergySeverity {
  MILD = 'mild',
  MODERATE = 'moderate',
  SEVERE = 'severe',
}

@Entity('allergies')
export class Allergy {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  dogId: string;

  @ManyToOne(() => Dog, (dog) => dog.allergies, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'dogId' })
  dog: Dog;

  @Column({ type: 'varchar' })
  allergen: string;

  @Column({ type: 'enum', enum: AllergyType })
  allergyType: AllergyType;

  @Column({ type: 'enum', enum: AllergySeverity })
  severity: AllergySeverity;

  @Column({ type: 'text', nullable: true })
  symptoms: string;

  @Column({ type: 'date', nullable: true })
  diagnosedDate: Date;

  @Column({ type: 'varchar', nullable: true })
  diagnosedBy: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;
}