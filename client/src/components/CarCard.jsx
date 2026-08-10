import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users, Fuel, Gauge, ArrowRight } from 'lucide-react';
import './CarCard.css';

export const CarCard = ({ car }) => {
  return (
    <div className="car-card">
      <div className="car-card-image-wrapper">
        <img 
          src={car.image || 'https://images.unsplash.com/photo-1536700503339-1e4b06520771?auto=format&fit=crop&w=1200&q=80'} 
          alt={`${car.brand} ${car.model}`} 
          className="car-card-image"
          loading="lazy"
        />
        <div className="car-card-badges">
          <span className="category-tag">{car.category}</span>
          <span className={`badge ${car.isAvailable ? 'badge-available' : 'badge-unavailable'}`}>
            {car.isAvailable ? 'Available' : 'Rented Out'}
          </span>
        </div>
      </div>

      <div className="car-card-body">
        <div className="car-card-header">
          <h3 className="car-title">{car.brand} {car.model}</h3>
          <span className="car-year">{car.year}</span>
        </div>

        <div className="car-location">
          <MapPin size={14} />
          <span>{car.location}</span>
        </div>

        <div className="car-specs-grid">
          <div className="spec-item">
            <Users size={16} />
            <span className="spec-value">{car.seating_capacity} Seats</span>
          </div>
          <div className="spec-item">
            <Fuel size={16} />
            <span className="spec-value">{car.fuel_type}</span>
          </div>
          <div className="spec-item">
            <Gauge size={16} />
            <span className="spec-value">{car.transmission}</span>
          </div>
        </div>

        <div className="car-card-footer">
          <div className="car-price-block">
            <span className="price-amount">${car.pricePerDay}</span>
            <span className="price-unit">per day</span>
          </div>

          <Link to={`/cars/${car._id}`} className="btn btn-primary btn-sm">
            <span>Details</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};
