import express, { Application } from 'express';
import cors from "cors"; 
import cookieParser from 'cookie-parser';
import notFound from './app/middlewares/notFound';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import router from './app/routes';

const app: Application = express();

// --- CORS config ---
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5000',
  'http://clickeibazar.com',
  'http://www.clickeibazar.com',
  'https://clickeibazar.com',
  'https://www.clickeibazar.com'
];

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Must be first
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Preflight requests

// Middleware
app.use(cookieParser());
app.use(express.json());

// Routes
app.use('/api/v1', router);

// Error handling
app.use(notFound);
app.use(globalErrorHandler);

export default app;
