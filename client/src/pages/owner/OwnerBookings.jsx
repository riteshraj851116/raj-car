import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import toast from 'react-hot-toast';
import { Calendar, User, Mail } from 'lucide-react';
import './OwnerBookings.css';

export const OwnerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOwnerBookings = async () => {
    try {
      const res = await api.get('/bookings/owner');
      setBookings(res.data);
    } catch (err) {
      toast.error(err.userMessage || 'Failed to fetch car bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwnerBookings();
  }, []);

  const handleStatusUpdate = async (bookingId, newStatus) => {
    setUpdatingId(bookingId);
    try {
      const res = await api.put(`/bookings/${bookingId}/status`, { status: newStatus });
      toast.success(res.data.message || `Booking marked as ${newStatus}`);
      fetchOwnerBookings();
    } catch (err) {
      toast.error(err.userMessage || 'Failed to update booking status');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
        <p style={{ marginTop: '12px', color: 'var(--text-muted)' }}>Loading car rental reservations...</p>
      </div>
    );
  }

  return (
    <div className="owner-page">
      <div className="container">
        <div className="owner-header">
          <div>
            <h1 className="owner-title">Fleet Rental Reservations</h1>
            <p style={{ color: 'var(--text-muted)' }}>
              Manage customer reservations, confirm pending requests, or mark completed rentals.
            </p>
          </div>
        </div>

        {bookings.length > 0 ? (
          <div>
            {bookings.map((booking) => {
              const car = booking.car;
              const customer = booking.user;

              return (
                <div key={booking._id} className="owner-bookings-card">
                  <img
                    src={car?.image || 'https://images.unsplash.com/photo-1536700503339-1e4b06520771?auto=format&fit=crop&w=1200&q=80'}
                    alt={car ? car.model : 'Vehicle'}
                    className="owner-booking-car-img"
                  />

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--secondary)' }}>
                        {car ? `${car.brand} ${car.model}` : 'Vehicle'}
                      </h3>
                      <span className={`badge badge-${booking.status}`}>{booking.status}</span>
                    </div>

                    <div style={{ fontSize: '0.88rem', color: 'var(--text-dark)', marginBottom: '8px', display: 'flex', gap: '16px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <User size={14} /> {customer?.name || 'Customer'}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
                        <Mail size={14} /> {customer?.email}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Calendar size={14} /> {booking.pickupDate} → {booking.returnDate} ({booking.totalDays} days)
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>
                      ${booking.totalPrice}
                    </div>

                    <div className="status-btn-group">
                      {booking.status !== 'confirmed' && (
                        <button
                          onClick={() => handleStatusUpdate(booking._id, 'confirmed')}
                          className="btn btn-primary btn-sm"
                          disabled={updatingId === booking._id}
                        >
                          Confirm
                        </button>
                      )}
                      {booking.status !== 'completed' && booking.status !== 'cancelled' && (
                        <button
                          onClick={() => handleStatusUpdate(booking._id, 'completed')}
                          className="btn btn-outline btn-sm"
                          disabled={updatingId === booking._id}
                        >
                          Complete
                        </button>
                      )}
                      {booking.status !== 'cancelled' && (
                        <button
                          onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
                          className="btn btn-danger btn-sm"
                          disabled={updatingId === booking._id}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <h3 className="empty-state-title">No bookings found for your fleet</h3>
            <p className="empty-state-description">
              When customers place rental bookings for your vehicles, they will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
