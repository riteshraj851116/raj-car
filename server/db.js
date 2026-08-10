import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.includes('username:password') || uri === 'YOUR_MONGODB_URI') {
    console.log('ℹ️ MONGODB_URI not provided or using template string. Running with integrated database store.');
    return false;
  }

  try {
    await mongoose.connect(uri);
    console.log('✅ Connected successfully to MongoDB Atlas');
    return true;
  } catch (error) {
    console.error('⚠️ MongoDB connection error:', error);
    console.log('ℹ️ Fallback to integrated store for application stability.');
    return false;
  }
}
