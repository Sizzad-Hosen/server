import express, { Application, Request, Response } from 'express'

import cors from "cors"; 

import cookieParser from 'cookie-parser';
import router from './app/routes';
import notFound from './app/middlewares/notFound';
import globalErrorHandler from './app/middlewares/globalErrorHandler';

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
app.use(notFound)
app.use(globalErrorHandler)

export default app;
