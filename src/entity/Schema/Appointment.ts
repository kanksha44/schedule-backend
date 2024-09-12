import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, user => user.id)
  user!: User;

  @Column()
  appointmentDate!: Date;

  @Column({ default: false })
  smsSent!: boolean;
}
