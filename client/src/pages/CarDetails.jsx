import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';
import { MapPin, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import './CarDetails.css';

export const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Booking Form
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');

  // Get today's ISO date string (YYYY-MM-DD) for min attribute
  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await api.get(`/cars/${id}`);
        setCar(res.data);
      } catch (err) {
        toast.error(err.userMessage || 'Car not found');
        navigate('/cars');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchCar();
  }, [id, navigate]);

  // Calculate rental duration and total price
  let totalDays = 0;
  let totalPrice = 0;

  if (pickupDate && returnDate) {
    const pDate = new Date(pickupDate);
    const rDate = new Date(returnDate);
    if (!isNaN(pDate.getTime()) && !isNaN(rDate.getTime()) && rDate > pDate) {
      const diff = Math.abs(rDate.getTime() - pDate.getTime());
      totalDays = Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
      if (car) {
        totalPrice = totalDays * car.pricePerDay;
      }
    }
  }

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please login first to book a car');
      navigate('/login', { state: { from: `/cars/${id}` } });
      return;
    }

    if (!pickupDate || !returnDate) {
      toast.error('Please select both pickup and return dates');
      return;
    }

    const pDate = new Date(pickupDate);
    const rDate = new Date(returnDate);
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    pDate.setHours(0, 0, 0, 0);
    rDate.setHours(0, 0, 0, 0);

    if (pDate < now) {
      toast.error('Pickup date cannot be in the past');
      return;
    }

    if (rDate <= pDate) {
      toast.error('Return date must be after pickup date');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/bookings', {
        carId: id,
        pickupDate,
        returnDate,
      });

      toast.success(res.data.message || 'Car booked successfully!');
      navigate('/my-bookings');
    } catch (err) {
      toast.error(err.userMessage || 'Failed to complete booking');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
        <p style={{ marginTop: '12px', color: 'var(--text-muted)' }}>Loading car details...</p>
      </div>
    );
  }

  if (!car) return null;

  return (
    <div className="car-details-page">
      <div className="container">
        <Link to="/cars" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontWeight: 600, marginBottom: '24px' }}>
          <ArrowLeft size={16} /> Back to Cars
        </Link>

        <div className="details-grid">
          {/* Main Car Specs Column */}
          <div>
            <div className="details-image-card">
              <img src={car.image} alt={`${car.brand} ${car.model}`} className="details-main-image" />
            </div>

            <div className="details-info-card">
              <div className="details-header">
                <div>
                  <h1 className="details-title">{car.brand} {car.model}</h1>
                  <div className="details-sub">
                    <span>Year {car.year}</span>
                    <span>•</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={16} /> {car.location}
                    </span>
                  </div>
                </div>

                <span className={`badge ${car.isAvailable ? 'badge-available' : 'badge-unavailable'}`} style={{ fontSize: '0.9rem', padding: '6px 14px' }}>
                  {car.isAvailable ? 'Available Now' : 'Rented'}
                </span>
              </div>

              <div className="details-specs-banner">
                <div className="details-spec-box">
                  <span className="details-spec-label">Category</span>
                  <span className="details-spec-val">{car.category}</span>
                </div>
                <div className="details-spec-box">
                  <span className="details-spec-label">Seats</span>
                  <span className="details-spec-val">{car.seating_capacity} Persons</span>
                </div>
                <div className="details-spec-box">
                  <span className="details-spec-label">Fuel</span>
                  <span className="details-spec-val">{car.fuel_type}</span>
                </div>
                <div className="details-spec-box">
                  <span className="details-spec-label">Transmission</span>
                  <span className="details-spec-val">{car.transmission}</span>
                </div>
              </div>

              <h3 className="details-section-title">Vehicle Description</h3>
              <p className="details-desc">{car.description}</p>

              <h3 className="details-section-title">Why You'll Love Renting This Car</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--text-dark)' }}>
                  <CheckCircle2 size={18} color="var(--success)" /> Thoroughly Cleaned & Sanitized
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--text-dark)' }}>
                  <CheckCircle2 size={18} color="var(--success)" /> 24/7 Local Roadside Support
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--text-dark)' }}>
                  <CheckCircle2 size={18} color="var(--success)" /> Insurance Coverage Included
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--text-dark)' }}>
                  <CheckCircle2 size={18} color="var(--success)" /> Easy & Flexible Cancellation
                </div>
              </div>
            </div>
          </div>

          {/* Booking Column */}
          <div>
            <div className="booking-card">
              <div className="booking-card-header">
                <div>
                  <span className="booking-price">${car.pricePerDay}</span>
                  <span className="booking-price-unit"> / day</span>
                </div>
                <span className="badge badge-available">Best Price Guaranteed</span>
              </div>

              {!car.isAvailable ? (
                <div className="empty-state" style={{ padding: '24px', margin: 0 }}>
                  <AlertCircle size={32} color="var(--danger)" style={{ marginBottom: '8px' }} />
                  <p className="empty-state-title" style={{ fontSize: '1.1rem' }}>Currently Unavailable</p>
                  <p className="empty-state-description" style={{ fontSize: '0.85rem' }}>
                    This vehicle is currently marked as unavailable by the owner.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit}>
                  <div className="form-group">
                    <label className="form-label">Pickup Date</label>
                    <input
                      type="date"
                      className="form-input"
                      min={todayStr}
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Return Date</label>
                    <input
                      type="date"
                      className="form-input"
                      min={pickupDate || todayStr}
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      required
                    />
                  </div>

                  {totalDays > 0 && (
                    <div className="booking-summary-box">
                      <div className="summary-row">
                        <span>${car.pricePerDay} × {totalDays} {totalDays === 1 ? 'day' : 'days'}</span>
                        <span>${totalPrice}</span>
                      </div>
                      <div className="summary-row">
                        <span>Insurance & Fees</span>
                        <span>Included</span>
                      </div>
                      <div className="summary-row total">
                        <span>Total Payable</span>
                        <span>${totalPrice}</span>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    style={{ width: '100%', marginTop: '12px' }}
                    disabled={submitting}
                  >
                    {submitting ? 'Processing Booking...' : 'Book Now'}
                  </button>

                  {!user && (
                    <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '12px' }}>
                      You will be asked to login before confirming booking.
                    </p>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
