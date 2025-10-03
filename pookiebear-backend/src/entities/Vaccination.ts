import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Dog } from './Dog';

@Entity('vaccinations')
export class Vaccination {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  dogId: string;

  @ManyToOne(() => Dog, (dog) => dog.vaccinations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'dogId' })
  dog: Dog;

  @Column({ type: 'varchar' })
  vaccineType: string;

  @Column({ type: 'varchar' })
  vaccineName: string;

  @Column({ type: 'date' })
  administrationDate: Date;

  @Column({ type: 'date', nullable: true })
  expirationDate: Date;

  @Column({ type: 'varchar', nullable: true })
  administeredBy: string;

  @Column({ type: 'uuid', nullable: true })
  vetClinicId: string;

  @Column({ type: 'varchar', nullable: true })
  lotNumber: string;

  @Column({ type: 'date' })
  nextDueDate: Date;

  @Column({ type: 'boolean', default: false })
  reminderSent: boolean;

  @Column({ type: 'varchar', nullable: true })
  certificateUrl: string;

  @CreateDateColumn()
  createdAt: Date;
}