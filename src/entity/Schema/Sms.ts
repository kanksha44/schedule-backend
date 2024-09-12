import { Column, Entity, PrimaryGeneratedColumn,ManyToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class Sms{
    @PrimaryGeneratedColumn()
    id!:number;

    @Column()
    text!:string;

    @Column()
    scheduledAt!: Date;

    @ManyToOne(() => User, user => user.sms)
    user!: User;

    @Column()
    userId!: number;

    @Column({ nullable: true })
    sentAt!: Date;


}