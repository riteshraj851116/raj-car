import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api.js';
import toast from 'react-hot-toast';
import {
  Calendar,
  MapPin,
  XCircle,
  ArrowRight,
  Car as CarIcon,
  Clock3,
  CheckCircle2,
} from 'lucide-react';
import './MyBookings.css';

export const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings/my');
      setBookings(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      toast.error(err.userMessage || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    setCancellingId(bookingId);

    try {
      const res = await api.put(`/bookings/${bookingId}/cancel`);

      toast.success(
        res.data.message || 'Booking cancelled successfully'
      );

      fetchBookings();
    } catch (err) {
      toast.error(
        err.userMessage || 'Failed to cancel booking'
      );
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'confirmed':
        return 'booking-status confirmed';

      case 'pending':
        return 'booking-status pending';

      case 'completed':
        return 'booking-status completed';

      case 'cancelled':
        return 'booking-status cancelled';

      default:
        return 'booking-status pending';
    }
  };

  const getStatusIcon = (status) => {
    if (status === 'confirmed') {
      return <CheckCircle2 size={14} />;
    }

    if (status === 'completed') {
      return <CheckCircle2 size={14} />;
    }

    if (status === 'pending') {
      return <Clock3 size={14} />;
    }

    return <XCircle size={14} />;
  };

  if (loading) {
    return (
      <div className="bookings-page">
        <div className="container">
          <div className="bookings-loading">
            <div className="spinner" />
            <p>Loading your bookings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bookings-page">
      <div className="container">

        <div className="bookings-header">
          <span className="bookings-eyebrow">
            Your Journey
          </span>

          <h1 className="bookings-title">
            My Bookings
          </h1>

          <p className="bookings-subtitle">
            Keep track of your upcoming rides and previous trips.
          </p>
        </div>

        {bookings.length > 0 ? (
          <div className="bookings-list">

            {bookings.map((booking) => {
              const car = booking.car;

              return (
                <div
                  key={booking._id}
                  className="booking-card-item"
                >

                  <div className="booking-image-wrapper">
                    <img
                      src={
                        car?.image ||
                        'https://images.unsplash.com/photo-1536700503339-1e4b06520771?auto=format&fit=crop&w=1200&q=80'
                      }
                      alt={
                        car
                          ? `${car.brand} ${car.model}`
                          : 'Car'
                      }
                      className="booking-car-thumb"
                    />

                    <span
                      className={getStatusBadgeClass(
                        booking.status
                      )}
                    >
                      {getStatusIcon(booking.status)}
                      {booking.status}
                    </span>
                  </div>

                  <div className="booking-car-info">

                    <div>
                      <span className="booking-car-label">
                        Reserved Vehicle
                      </span>

                      <h3 className="booking-car-name">
                        {car
                          ? `${car.brand} ${car.model}`
                          : 'Car Rental'}
                      </h3>
                    </div>

                    <div className="booking-dates-row">

                      <div className="booking-date-box">
                        <span className="date-label">
                          Pickup
                        </span>

                        <div className="date-value">
                          <Calendar size={15} />
                          {booking.pickupDate}
                        </div>
                      </div>

                      <div className="date-arrow">
                        <ArrowRight size={18} />
                      </div>

                      <div className="booking-date-box">
                        <span className="date-label">
                          Return
                        </span>

                        <div className="date-value">
                          <Calendar size={15} />
                          {booking.returnDate}
                        </div>
                      </div>

                    </div>

                    <div className="booking-meta">

                      <span>
                        <Clock3 size={14} />
                        {booking.totalDays}{' '}
                        {booking.totalDays === 1
                          ? 'day'
                          : 'days'}
                      </span>

                      {car?.location && (
                        <span>
                          <MapPin size={14} />
                          {car.location}
                        </span>
                      )}

                    </div>

                  </div>

                  <div className="booking-price-col">

                    <div className="price-label">
                      Total Rental
                    </div>

                    <div className="booking-total-price">
                      ₹{booking.totalPrice}
                    </div>

                    <div className="booking-actions">

                      {booking.status !== 'cancelled' &&
                        booking.status !== 'completed' && (
                          <button
                            onClick={() =>
                              handleCancel(booking._id)
                            }
                            className="btn btn-danger btn-sm"
                            disabled={
                              cancellingId === booking._id
                            }
                          >
                            <XCircle size={15} />

                            {cancellingId === booking._id
                              ? 'Cancelling...'
                              : 'Cancel'}
                          </button>
                        )}

                      {car && (
                        <Link
                          to={`/cars/${car._id}`}
                          className="btn btn-outline btn-sm"
                        >
                          View Car
                          <ArrowRight size={15} />
                        </Link>
                      )}

                    </div>

                  </div>

                </div>
              );
            })}

          </div>
        ) : (
          <div className="empty-bookings">

            <div className="empty-bookings-icon">
              <CarIcon size={32} />
            </div>

            <span className="bookings-eyebrow">
              Nothing Here Yet
            </span>

            <h2>
              No bookings found
            </h2>

            <p>
              You haven't booked a vehicle yet.
              Explore our available cars and plan your
              next trip.
            </p>

            <Link
              to="/cars"
              className="btn btn-primary btn-lg"
            >
              Browse All Cars
              <ArrowRight size={18} />
            </Link>

          </div>
        )}

      </div>
    </div>
  );
};