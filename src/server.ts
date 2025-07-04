import { Server } from "http";
import app from "./app";
import cors from 'cors'
import express from 'express'
import mongoose from "mongoose";

let server:Server;


// Middleware
app.use(express.json())
app.use(cors())



async function main(){

    try {
        await mongoose.connect('')
    } catch (error) {

        console.error('Error connecting to the database or starting the server:', error)
        
    }
}


// start the application

main()


process.on('unhandledRejection', (reason) => {
  console.error('😈 Unhandled Rejection:', reason);
  // Optional: Close DB, Server, etc.
  process.exit(1);
});

process.on('uncaughtException', () => {
  console.log(`😈 uncaughtException is detected , shutting down ...`);
  process.exit(1);
});