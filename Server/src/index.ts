import express, { urlencoded } from 'express'
import cors from "cors";

import userRouter from './router/userRoutes'
import { FRONTEND_URL, PORT } from "./utils/constant";
const app=express()


const corsOptions = {
    origin: FRONTEND_URL() || "*",
    credentials: true,
  };
  
  app.use(cors(corsOptions)); 
  app.use(express.urlencoded({ extended: true }));
  
  app.use(express.json());
 
  app.use("/api/user", userRouter);


app.listen(PORT, () => console.log(`Server started running on port ${PORT}`));