import express from "express";
const cors = require('cors')
import dotenv from 'dotenv';
import { AppDataSource } from "./Connection/data-source";
import UserRoutes from "./routes/UserRoutes";

dotenv.config();

const app = express();
app.use(cors())
app.use(express.json());
// app.use(routes);

app.use('/api', UserRoutes);


AppDataSource.initialize()
  .then(() => {
    console.log("Connected to PostgreSQL database");

    app.listen(8000, () => {
      console.log("Server is running on http://localhost:8000");
    });
  })
  .catch((error) => console.log("Error connecting to the database", error));
