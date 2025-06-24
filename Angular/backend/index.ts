// index.ts
import express, { Application, Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import employeeRoutes from './routes/employee'; // make sure this is a .ts file too

dotenv.config();

const app: Application = express();

app.use(cors());
app.use(express.json());

const MONGODB_URI: string = process.env.MONGODB_URI || 'mongodb://localhost:27017/chatapp';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err: Error) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

app.use('/routes/employee', employeeRoutes);

// Use Request and Response types
app.get('/', (req: Request, res: Response) => {
  res.send('Employee Portal API is running');
});

const PORT: number = parseInt(process.env.PORT || '3000', 10);
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
