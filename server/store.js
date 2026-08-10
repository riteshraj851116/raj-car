import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { UserModel } from './models/User.js';
import { CarModel } from './models/Car.js';
import { BookingModel } from './models/Booking.js';

// Small local store used when MongoDB is unavailable
export const initialUsers = [
  {
    _id: 'user_renter_1',
    name: 'Alex Morgan',
    email: 'user@demo.com',
    password: '$2a$10$YourHashedPassword123HereDemoUserPass', // password123
    role: 'user',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'user_owner_1',
    name: 'Marcus Vance',
    email: 'owner@carrental.com',
    password: '$2a$10$YourHashedPassword123HereDemoOwnerPass', // password123
    role: 'owner',
    createdAt: new Date().toISOString(),
  },
];

export const initialCars = [
  {
    _id: 'car_1',
    owner: 'user_owner_1',
    brand: 'Porsche',
    model: '911 Carrera S',
    year: 2024,
    category: 'Sports',
    seating_capacity: 4,
    fuel_type: 'Petrol',
    transmission: 'Automatic',
    pricePerDay: 280,
    location: 'San Francisco, CA',
    description: 'Experience pure sports car performance with iconic 911 design, twin-turbo engine, twin exhaust system, and premium Bose audio.',
    image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80',
    isAvailable: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'car_2',
    owner: 'user_owner_1',
    brand: 'Tesla',
    model: 'Model S Plaid',
    year: 2023,
    category: 'Electric',
    seating_capacity: 5,
    fuel_type: 'Electric',
    transmission: 'Automatic',
    pricePerDay: 210,
    location: 'Los Angeles, CA',
    description: 'Unmatched acceleration, tri-motor all-wheel drive, full autopilot suite, and a futuristic minimalist glass-roof cabin.',
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=80',
    isAvailable: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'car_3',
    owner: 'user_owner_1',
    brand: 'BMW',
    model: 'M4 Competition',
    year: 2023,
    category: 'Sports',
    seating_capacity: 4,
    fuel_type: 'Petrol',
    transmission: 'Automatic',
    pricePerDay: 195,
    location: 'Miami, FL',
    description: 'Aggressive styling, 503 hp twin-turbo inline 6, carbon fiber interior package, and dynamic sport suspension.',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
    isAvailable: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'car_4',
    owner: 'user_owner_1',
    brand: 'Mercedes-Benz',
    model: 'G 63 AMG',
    year: 2024,
    category: 'SUV',
    seating_capacity: 5,
    fuel_type: 'Petrol',
    transmission: 'Automatic',
    pricePerDay: 350,
    location: 'New York, NY',
    description: 'The ultimate luxury off-road icon featuring a hand-built V8 biturbo, massage seats, Burmester surround sound, and striking presence.',
    image: 'https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&w=1200&q=80',
    isAvailable: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'car_5',
    owner: 'user_owner_1',
    brand: 'Audi',
    model: 'RS e-tron GT',
    year: 2024,
    category: 'Electric',
    seating_capacity: 5,
    fuel_type: 'Electric',
    transmission: 'Automatic',
    pricePerDay: 240,
    location: 'Seattle, WA',
    description: 'Electric grand tourer with breathtaking design, launch control acceleration, carbon ceramic brakes, and adaptive air suspension.',
    image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80',
    isAvailable: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'car_6',
    owner: 'user_owner_1',
    brand: 'Range Rover',
    model: 'Autobiography',
    year: 2023,
    category: 'Luxury',
    seating_capacity: 5,
    fuel_type: 'Hybrid',
    transmission: 'Automatic',
    pricePerDay: 290,
    location: 'Chicago, IL',
    description: 'Refined executive luxury SUV with executive rear seating, air suspension, whisper-quiet cabin, and all-terrain drive capability.',
    image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80',
    isAvailable: true,
    createdAt: new Date().toISOString(),
  },
];

export const memoryUsers = [...initialUsers];
export const memoryCars = [...initialCars];
export const memoryBookings = [];

// Demo accounts use the same password: password123
async function hashMemoryPasswords() {
  const salt = await bcrypt.genSalt(10);
  for (const u of memoryUsers) {
    if (!u.password.startsWith('$2a$')) {
      u.password = await bcrypt.hash('password123', salt);
    } else {
      u.password = await bcrypt.hash('password123', salt);
    }
  }
}
hashMemoryPasswords();

function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}

// Users
export async function findUserByEmail(email) {
  if (isMongoConnected()) {
    return await UserModel.findOne({ email: email.toLowerCase() });
  }
  return memoryUsers.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export async function findUserById(id) {
  if (isMongoConnected()) {
    return await UserModel.findById(id).select('-password');
  }
  const u = memoryUsers.find((user) => user._id === id);
  if (!u) return null;
  const { password, ...rest } = u;
  return rest;
}

export async function createUser(userData) {
  if (isMongoConnected()) {
    const newDoc = new UserModel(userData);
    return await newDoc.save();
  }
  const newUser = {
    _id: `user_${Date.now()}`,
    ...userData,
    createdAt: new Date().toISOString(),
  };
  memoryUsers.push(newUser);
  return newUser;
}

// Cars
export async function getCars(filters = {}) {
  if (isMongoConnected()) {
    const query = {};
    if (filters.brand) query.brand = new RegExp(filters.brand, 'i');
    if (filters.category) query.category = filters.category;
    if (filters.fuel_type) query.fuel_type = filters.fuel_type;
    if (filters.transmission) query.transmission = filters.transmission;
    if (filters.isAvailable !== undefined) query.isAvailable = filters.isAvailable;
    if (filters.ownerId) query.owner = filters.ownerId;
    if (filters.location) query.location = new RegExp(filters.location, 'i');
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      query.pricePerDay = {};
      if (filters.minPrice !== undefined) query.pricePerDay.$gte = filters.minPrice;
      if (filters.maxPrice !== undefined) query.pricePerDay.$lte = filters.maxPrice;
    }
    if (filters.search) {
      const searchRegex = new RegExp(filters.search, 'i');
      query.$or = [
        { brand: searchRegex },
        { model: searchRegex },
        { location: searchRegex },
        { category: searchRegex },
      ];
    }
    return await CarModel.find(query).sort({ createdAt: -1 });
  }

  // Memory fallback filtering
  let result = [...memoryCars];
  if (filters.brand) {
    result = result.filter((c) => c.brand.toLowerCase().includes(filters.brand.toLowerCase()));
  }
  if (filters.category) {
    result = result.filter((c) => c.category.toLowerCase() === filters.category.toLowerCase());
  }
  if (filters.fuel_type) {
    result = result.filter((c) => c.fuel_type.toLowerCase() === filters.fuel_type.toLowerCase());
  }
  if (filters.transmission) {
    result = result.filter((c) => c.transmission.toLowerCase() === filters.transmission.toLowerCase());
  }
  if (filters.isAvailable !== undefined) {
    result = result.filter((c) => c.isAvailable === filters.isAvailable);
  }
  if (filters.ownerId) {
    result = result.filter((c) => c.owner === filters.ownerId);
  }
  if (filters.location) {
    result = result.filter((c) => c.location.toLowerCase().includes(filters.location.toLowerCase()));
  }
  if (filters.minPrice !== undefined) {
    result = result.filter((c) => c.pricePerDay >= filters.minPrice);
  }
  if (filters.maxPrice !== undefined) {
    result = result.filter((c) => c.pricePerDay <= filters.maxPrice);
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (c) =>
        c.brand.toLowerCase().includes(q) ||
        c.model.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
    );
  }

  return result.reverse();
}

export async function getCarById(id) {
  if (isMongoConnected()) {
    return await CarModel.findById(id);
  }
  return memoryCars.find((c) => c._id === id) || null;
}

export async function createCar(carData) {
  if (isMongoConnected()) {
    const newCar = new CarModel(carData);
    return await newCar.save();
  }
  const newCar = {
    _id: `car_${Date.now()}`,
    ...carData,
    createdAt: new Date().toISOString(),
  };
  memoryCars.push(newCar);
  return newCar;
}

export async function updateCar(id, updateData) {
  if (isMongoConnected()) {
    return await CarModel.findByIdAndUpdate(id, updateData, { new: true });
  }
  const index = memoryCars.findIndex((c) => c._id === id);
  if (index === -1) return null;
  memoryCars[index] = { ...memoryCars[index], ...updateData };
  return memoryCars[index];
}

export async function deleteCar(id) {
  if (isMongoConnected()) {
    await CarModel.findByIdAndDelete(id);
    return true;
  }
  const index = memoryCars.findIndex((c) => c._id === id);
  if (index !== -1) {
    memoryCars.splice(index, 1);
    return true;
  }
  return false;
}

// Bookings
export async function checkBookingOverlap(carId, pickupDate, returnDate) {
  const pDate = new Date(pickupDate).getTime();
  const rDate = new Date(returnDate).getTime();

  if (isMongoConnected()) {
    const existing = await BookingModel.find({
      car: carId,
      status: { $in: ['pending', 'confirmed'] },
    });
    return existing.some((b) => {
      const bPick = new Date(b.pickupDate).getTime();
      const bRet = new Date(b.returnDate).getTime();
      return pDate < bRet && rDate > bPick;
    });
  }

  const existing = memoryBookings.filter(
    (b) => b.car === carId && ['pending', 'confirmed'].includes(b.status)
  );
  return existing.some((b) => {
    const bPick = new Date(b.pickupDate).getTime();
    const bRet = new Date(b.returnDate).getTime();
    return pDate < bRet && rDate > bPick;
  });
}

export async function createBooking(bookingData) {
  if (isMongoConnected()) {
    const newBooking = new BookingModel(bookingData);
    return await newBooking.save();
  }
  const newBooking = {
    _id: `booking_${Date.now()}`,
    ...bookingData,
    createdAt: new Date().toISOString(),
  };
  memoryBookings.push(newBooking);
  return newBooking;
}

export async function getUserBookings(userId) {
  if (isMongoConnected()) {
    return await BookingModel.find({ user: userId })
      .populate('car')
      .sort({ createdAt: -1 });
  }

  return memoryBookings
    .filter((b) => b.user === userId)
    .map((b) => {
      const car = memoryCars.find((c) => c._id === b.car);
      return { ...b, car };
    })
    .reverse();
}

export async function getOwnerBookings(ownerId) {
  if (isMongoConnected()) {
    const ownerCars = await CarModel.find({ owner: ownerId });
    const carIds = ownerCars.map((c) => c._id);
    return await BookingModel.find({ car: { $in: carIds } })
      .populate('car')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
  }

  const ownerCarIds = memoryCars.filter((c) => c.owner === ownerId).map((c) => c._id);
  return memoryBookings
    .filter((b) => ownerCarIds.includes(b.car))
    .map((b) => {
      const car = memoryCars.find((c) => c._id === b.car);
      const userObj = memoryUsers.find((u) => u._id === b.user);
      const user = userObj ? { name: userObj.name, email: userObj.email } : null;
      return { ...b, car, user };
    })
    .reverse();
}

export async function getBookingById(id) {
  if (isMongoConnected()) {
    return await BookingModel.findById(id);
  }
  return memoryBookings.find((b) => b._id === id) || null;
}

export async function updateBookingStatus(id, status) {
  if (isMongoConnected()) {
    return await BookingModel.findByIdAndUpdate(id, { status }, { new: true });
  }
  const booking = memoryBookings.find((b) => b._id === id);
  if (!booking) return null;
  booking.status = status;
  return booking;
}

export async function getOwnerStats(ownerId) {
  if (isMongoConnected()) {
    const ownerCars = await CarModel.find({ owner: ownerId });
    const carIds = ownerCars.map((c) => c._id);
    const bookings = await BookingModel.find({ car: { $in: carIds } });

    const totalCars = ownerCars.length;
    const availableCars = ownerCars.filter((c) => c.isAvailable).length;
    const totalBookings = bookings.length;
    const activeBookings = bookings.filter((b) => ['pending', 'confirmed'].includes(b.status)).length;
    const totalRevenue = bookings
      .filter((b) => b.status !== 'cancelled')
      .reduce((sum, b) => sum + b.totalPrice, 0);

    return { totalCars, availableCars, totalBookings, activeBookings, totalRevenue };
  }

  const ownerCars = memoryCars.filter((c) => c.owner === ownerId);
  const ownerCarIds = ownerCars.map((c) => c._id);
  const bookings = memoryBookings.filter((b) => ownerCarIds.includes(b.car));

  const totalCars = ownerCars.length;
  const availableCars = ownerCars.filter((c) => c.isAvailable).length;
  const totalBookings = bookings.length;
  const activeBookings = bookings.filter((b) => ['pending', 'confirmed'].includes(b.status)).length;
  const totalRevenue = bookings
    .filter((b) => b.status !== 'cancelled')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  return { totalCars, availableCars, totalBookings, activeBookings, totalRevenue };
}
