import { Router } from 'express';
import {
  getCarById,
  checkBookingOverlap,
  createBooking,
  getUserBookings,
  getOwnerBookings,
  getBookingById,
  updateBookingStatus,
} from '../store.js';
import { authenticateToken, requireOwner } from '../middleware/auth.js';

const router = Router();

// CREATE BOOKING (Authenticated Users)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { carId, pickupDate, returnDate } = req.body;

    if (!carId || !pickupDate || !returnDate) {
      return res.status(400).json({ message: 'Car, pickup date, and return date are required' });
    }

    const car = await getCarById(carId);
    if (!car) {
      return res.status(404).json({ message: 'Selected car not found' });
    }

    if (!car.isAvailable) {
      return res.status(400).json({ message: 'This car is currently marked as unavailable for rent' });
    }

    // Date validation
    const pDate = new Date(pickupDate);
    const rDate = new Date(returnDate);
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (isNaN(pDate.getTime()) || isNaN(rDate.getTime())) {
      return res.status(400).json({ message: 'Invalid pickup or return date format' });
    }

    pDate.setHours(0, 0, 0, 0);
    rDate.setHours(0, 0, 0, 0);

    if (pDate < now) {
      return res.status(400).json({ message: 'Pickup date cannot be in the past' });
    }

    if (rDate <= pDate) {
      return res.status(400).json({ message: 'Return date must be after pickup date' });
    }

    // Check overlap with existing active bookings
    const hasOverlap = await checkBookingOverlap(carId, pickupDate, returnDate);
    if (hasOverlap) {
      return res.status(400).json({
        message: 'This car is already booked for the selected dates. Please choose different dates.',
      });
    }

    // Calculate rental days & price
    const diffTime = Math.abs(rDate.getTime() - pDate.getTime());
    const totalDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    const totalPrice = totalDays * car.pricePerDay;

    const newBooking = await createBooking({
      user: req.user.id,
      car: car._id,
      pickupDate,
      returnDate,
      totalDays,
      totalPrice,
      status: 'confirmed',
    });

    res.status(201).json({
      message: 'Booking created successfully!',
      booking: newBooking,
    });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ message: 'Failed to create booking' });
  }
});

// GET LOGGED-IN USER BOOKINGS
router.get('/my', authenticateToken, async (req, res) => {
  try {
    const bookings = await getUserBookings(req.user.id);
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch your bookings' });
  }
});

// GET OWNER BOOKINGS
router.get('/owner', authenticateToken, requireOwner, async (req, res) => {
  try {
    const bookings = await getOwnerBookings(req.user.id);
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch owner bookings' });
  }
});

// UPDATE BOOKING STATUS (Owner only)
router.put('/:id/status', authenticateToken, requireOwner, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid booking status' });
    }

    const booking = await getBookingById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const car = await getCarById(booking.car);
    if (!car || car.owner.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'You can only update bookings for your own cars' });
    }

    const updated = await updateBookingStatus(req.params.id, status);
    res.json({ message: `Booking status updated to ${status}`, booking: updated });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update booking status' });
  }
});

// USER CANCEL BOOKING
router.put('/:id/cancel', authenticateToken, async (req, res) => {
  try {
    const booking = await getBookingById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'You can only cancel your own bookings' });
    }

    if (booking.status === 'completed') {
      return res.status(400).json({ message: 'Completed bookings cannot be cancelled' });
    }

    const updated = await updateBookingStatus(req.params.id, 'cancelled');
    res.json({ message: 'Booking cancelled successfully', booking: updated });
  } catch (error) {
    res.status(500).json({ message: 'Failed to cancel booking' });
  }
});

export default router;
