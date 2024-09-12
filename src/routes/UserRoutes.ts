import { Router } from 'express';
import {CreateUser,getAllUser,bookAppointment} from "../controller/userController";

const routes = Router();


routes.post("/createUser", CreateUser);
routes.get("/getAllUser", getAllUser);
// routes.post('/sendSms', sendMessage)
routes.post('/scheduleSms', bookAppointment)


routes.get('/', async(req, res) => {
    res.send('Hello World');
  });

  export default routes;
