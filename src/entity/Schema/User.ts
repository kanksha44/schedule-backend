import { Column, Entity, PrimaryGeneratedColumn,OneToMany } from "typeorm";
import { Sms } from "./Sms";


@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id!:number;

    @Column()
    name!:string;
   
    @Column()
    phoneNumber!: string;

    @OneToMany(() => Sms, sms => sms.user)
    sms!: Sms[];


}