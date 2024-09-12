import { DataSource } from "typeorm";
import {User} from "../entity/Schema/User"
import { Sms } from "../entity/Schema/Sms";

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'demo',
    entities: [User,Sms], 
    synchronize: true, 
    logging: true,
  })