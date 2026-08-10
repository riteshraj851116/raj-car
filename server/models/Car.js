import mongoose from 'mongoose';

const CarSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  category: { type: String, required: true },
  seating_capacity: { type: Number, required: true, default: 5 },
  fuel_type: { type: String, required: true, default: 'Petrol' },
  transmission: { type: String, required: true, default: 'Automatic' },
  pricePerDay: { type: Number, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  isAvailable: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export const CarModel = mongoose.models.Car || mongoose.model('Car', CarSchema);
