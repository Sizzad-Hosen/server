import express, { Application, Request, Response } from 'express'

import cors from "cors"; 

import cookieParser from 'cookie-parser';
import router from './app/routes';

const app:Application = express()

// middleware

app.use(cookieParser())
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5000'],
    credentials: true, // <-- Add this line
}))












app.use(express.json())

// application routes

app.use('/api/v1',router)


export default app;
