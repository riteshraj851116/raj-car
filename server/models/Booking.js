import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
  pickupDate: { type: String, required: true },
  returnDate: { type: String, required: true },
  totalDays: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'confirmed',
  },
  createdAt: { type: Date, default: Date.now },
});

export const BookingModel = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
