import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CarCard } from '../components/CarCard.jsx';
import { api } from '../services/api.js';
import { SlidersHorizontal, RefreshCw, Car as CarIcon } from 'lucide-react';
import './Cars.css';

export const Cars = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [fuelType, setFuelType] = useState(searchParams.get('fuel_type') || 'All');
  const [transmission, setTransmission] = useState(searchParams.get('transmission') || 'All');
  const [maxPrice, setMaxPrice] = useState(300);
  const [sortBy, setSortBy] = useState('featured');

  const fetchCars = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.set('search', search);
      if (category && category !== 'All') queryParams.set('category', category);
      if (fuelType && fuelType !== 'All') queryParams.set('fuel_type', fuelType);
      if (transmission && transmission !== 'All') queryParams.set('transmission', transmission);
      if (maxPrice) queryParams.set('maxPrice', maxPrice.toString());

      const res = await api.get(`/cars?${queryParams.toString()}`);
      setCars(res.data);
    } catch (err) {
      console.error('Failed to load cars', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, [search, category, fuelType, transmission, maxPrice]);

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setFuelType('All');
    setTransmission('All');
    setMaxPrice(300);
    setSortBy('featured');
    setSearchParams({});
  };

  // Sorting
  const sortedCars = [...cars].sort((a, b) => {
    if (sortBy === 'price-asc') return a.pricePerDay - b.pricePerDay;
    if (sortBy === 'price-desc') return b.pricePerDay - a.pricePerDay;
    return 0;
  });

  return (
    <div className="cars-page">
      <div className="container">
        <div className="cars-header">
          <h1 className="cars-header-title">Find Your Next Ride</h1>
          <p className="cars-header-subtitle">
            Filter by budget, transmission, or body style to pinpoint the exact car for your upcoming road trip or daily commute.
          </p>
        </div>

        <div className="cars-layout">
          {/* Sidebar Filter */}
          <aside className="filter-sidebar">
            <div className="filter-header">
              <span className="filter-title">
                <SlidersHorizontal size={18} /> Filters
              </span>
              <button className="reset-btn" onClick={handleResetFilters}>
                Reset All
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">Search Keyword</label>

              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Brand, model or location..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="All">All Categories</option>
                <option value="SUV">SUV</option>
                <option value="Luxury">Luxury</option>
                <option value="Electric">Electric</option>
                <option value="Sports">Sports</option>
                <option value="Sedan">Sedan</option>
                <option value="Convertible">Convertible</option>
                <option value="Truck">Truck</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Fuel Type</label>
              <select
                className="form-select"
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value)}
              >
                <option value="All">All Fuel Types</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Transmission</label>
              <select
                className="form-select"
                value={transmission}
                onChange={(e) => setTransmission(e.target.value)}
              >
                <option value="All">All Transmissions</option>
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Max Price Per Day (${maxPrice})</label>
              <input
                type="range"
                min="30"
                max="500"
                step="10"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                style={{ width: '100%' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span>$30</span>
                <span>$500+</span>
              </div>
            </div>
          </aside>

          {/* Main Results */}
          <main>
            <div className="cars-results-header">
              <span className="results-count">
                Showing {sortedCars.length} {sortedCars.length === 1 ? 'vehicle' : 'vehicles'}
              </span>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Sort By:
                </span>
                <select
                  className="form-select"
                  style={{ width: '160px', padding: '6px 12px', fontSize: '0.85rem' }}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="spinner-container">
                <div className="spinner"></div>
                <p style={{ marginTop: '12px', color: 'var(--text-muted)' }}>Searching available cars...</p>
              </div>
            ) : sortedCars.length > 0 ? (
              <div className="car-grid">
                {sortedCars.map((car) => (
                  <CarCard key={car._id} car={car} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <CarIcon className="empty-state-icon" />
                <h3 className="empty-state-title">No cars match your criteria</h3>
                <p className="empty-state-description">
                  Try adjusting your search parameters, expanding price range, or selecting a different fuel type.
                </p>
                <button className="btn btn-outline btn-sm" onClick={handleResetFilters}>
                  <RefreshCw size={14} /> Clear All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
