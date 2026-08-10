import { Router } from 'express';
import { getCars, getCarById, createCar, updateCar, deleteCar } from '../store.js';
import { authenticateToken, requireOwner } from '../middleware/auth.js';

const router = Router();

// GET ALL CARS (Public with filters)
router.get('/', async (req, res) => {
  try {
    const {
      brand,
      category,
      fuel_type,
      transmission,
      minPrice,
      maxPrice,
      search,
      location,
      isAvailable,
      ownerId,
    } = req.query;

    const cars = await getCars({
      brand: brand ? String(brand) : undefined,
      category: category ? String(category) : undefined,
      fuel_type: fuel_type ? String(fuel_type) : undefined,
      transmission: transmission ? String(transmission) : undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      search: search ? String(search) : undefined,
      location: location ? String(location) : undefined,
      isAvailable: isAvailable !== undefined ? String(isAvailable) === 'true' : undefined,
      ownerId: ownerId ? String(ownerId) : undefined,
    });

    res.json(cars);
  } catch (error) {
    console.error('Error fetching cars:', error);
    res.status(500).json({ message: 'Failed to fetch cars' });
  }
});

// GET CAR BY ID
router.get('/:id', async (req, res) => {
  try {
    const car = await getCarById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.json(car);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch car details' });
  }
});

// CREATE CAR (Owner only)
router.post('/', authenticateToken, requireOwner, async (req, res) => {
  try {
    const {
      brand,
      model,
      year,
      category,
      pricePerDay,
      fuel_type,
      transmission,
      seating_capacity,
      location,
      description,
      image,
      isAvailable,
    } = req.body;

    if (!brand || !model || !pricePerDay || !location || !description) {
      return res.status(400).json({ message: 'Brand, model, price per day, location, and description are required' });
    }

    const newCar = await createCar({
      owner: req.user.id,
      brand,
      model,
      year: Number(year) || new Date().getFullYear(),
      category: category || 'Sedan',
      seating_capacity: Number(seating_capacity) || 5,
      fuel_type: fuel_type || 'Petrol',
      transmission: transmission || 'Automatic',
      pricePerDay: Number(pricePerDay),
      location,
      description,
      image: image || 'https://images.unsplash.com/photo-1536700503339-1e4b06520771?auto=format&fit=crop&w=1200&q=80',
      isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : true,
    });

    res.status(201).json({ message: 'Car added successfully', car: newCar });
  } catch (error) {
    console.error('Create car error:', error);
    res.status(500).json({ message: 'Failed to create car' });
  }
});

// UPDATE CAR (Owner only)
router.put('/:id', authenticateToken, requireOwner, async (req, res) => {
  try {
    const existingCar = await getCarById(req.params.id);
    if (!existingCar) {
      return res.status(404).json({ message: 'Car not found' });
    }

    if (existingCar.owner.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'You can only update your own cars' });
    }

    const updated = await updateCar(req.params.id, req.body);
    res.json({ message: 'Car updated successfully', car: updated });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update car' });
  }
});

// TOGGLE AVAILABILITY (Owner only)
router.patch('/:id/availability', authenticateToken, requireOwner, async (req, res) => {
  try {
    const existingCar = await getCarById(req.params.id);
    if (!existingCar) {
      return res.status(404).json({ message: 'Car not found' });
    }

    if (existingCar.owner.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'You can only modify your own cars' });
    }

    const isAvailable = req.body.isAvailable !== undefined ? req.body.isAvailable : !existingCar.isAvailable;
    const updated = await updateCar(req.params.id, { isAvailable });
    res.json({ message: 'Car availability updated', car: updated });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update availability' });
  }
});

// DELETE CAR (Owner only)
router.delete('/:id', authenticateToken, requireOwner, async (req, res) => {
  try {
    const existingCar = await getCarById(req.params.id);
    if (!existingCar) {
      return res.status(404).json({ message: 'Car not found' });
    }

    if (existingCar.owner.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own cars' });
    }

    await deleteCar(req.params.id);
    res.json({ message: 'Car deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete car' });
  }
});

export default router;
