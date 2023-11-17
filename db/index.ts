import { connect, set } from 'mongoose';
import envConfig from '@/config';

let isConnected = false;
export default async function connectToDb() {
  set('strictQuery', true);
  try {
    if (isConnected) {
      console.log('Using existing database connection');
      return;
    }
    await connect(envConfig.MONGODB_URI, { dbName: 'dev_overflow' });
    console.log('Connected to database');
    isConnected = true;
  } catch (err) {
    console.log('Failed to connect to database', err);
  }
}
