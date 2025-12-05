import mongoose from 'mongoose';

const DEFAULT_URI = 'mongodb+srv://smart_calculator:uUWiukcuqeEEI9cQ@smartcalculator.ponywmb.mongodb.net/?appName=smartCalculator';

const MONGODB_URI = process.env.MONGODB_URI || DEFAULT_URI;

export async function connectMongo(): Promise<void> {
  if (!MONGODB_URI) {
    throw new Error('La variable de entorno MONGODB_URI no está definida y no hay URI por defecto.');
  }

  if (mongoose.connection.readyState === 1) {
    return;
  }

  await mongoose.connect(MONGODB_URI, {
    autoIndex: true,
  });
}
