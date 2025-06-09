import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRouter from './routes/auth.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import customersRouter from './routes/customers.js';
import dotenv from 'dotenv';


try {
    await mongoose.connect('mongodb://127.0.0.1:27017/virtual-bank');
    console.log('Connected to database');
} catch {
    console.log('Unable to reach database service');
}

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded());

app.use('/api/customers', customersRouter);

dotenv.config();

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/virtual-bank' }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

app.use('/api/auth', authRouter);

app.listen(3001, () => console.log('Server is running'));

