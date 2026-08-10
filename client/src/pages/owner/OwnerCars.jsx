import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import toast from 'react-hot-toast';
import { PlusCircle, Edit3, Trash2, ToggleLeft, ToggleRight, MapPin } from 'lucide-react';
import './OwnerCars.css';

export const OwnerCars = () => {
  const { user } = useAuth();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOwnerCars = async () => {
    try {
      if (user) {
        const res = await api.get(`/cars?ownerId=${user._id}`);
        setCars(res.data);
      }
    } catch (err) {
      toast.error(err.userMessage || 'Failed to fetch owner cars');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwnerCars();
  }, [user]);

  const handleToggleAvailability = async (carId, currentStatus) => {
    try {
      const res = await api.patch(`/cars/${carId}/availability`, { isAvailable: !currentStatus });
      toast.success(res.data.message || 'Availability updated');
      fetchOwnerCars();
    } catch (err) {
      toast.error(err.userMessage || 'Failed to update status');
    }
  };

  const handleDeleteCar = async (carId, carTitle) => {
    if (!window.confirm(`Are you sure you want to delete ${carTitle}? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await api.delete(`/cars/${carId}`);
      toast.success(res.data.message || 'Car deleted successfully');
      fetchOwnerCars();
    } catch (err) {
      toast.error(err.userMessage || 'Failed to delete car');
    }
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
        <p style={{ marginTop: '12px', color: 'var(--text-muted)' }}>Loading your listed vehicles...</p>
      </div>
    );
  }

  return (
    <div className="owner-page">
      <div className="container">
        <div className="owner-header">
          <div>
            <h1 className="owner-title">Manage Fleet Vehicles</h1>
            <p style={{ color: 'var(--text-muted)' }}>
              Edit specifications, adjust daily rental rates, or toggle vehicle availability.
            </p>
          </div>

          <Link to="/owner/add-car" className="btn btn-primary">
            <PlusCircle size={18} /> Add New Vehicle
          </Link>
        </div>

        {cars.length > 0 ? (
          <div className="owner-cars-grid">
            {cars.map((car) => (
              <div key={car._id} className="owner-car-card">
                <div className="owner-car-img-box">
                  <img src={car.image} alt={car.brand} className="owner-car-img" />
                  <span className={`badge ${car.isAvailable ? 'badge-available' : 'badge-unavailable'}`} style={{ position: 'absolute', top: 12, right: 12 }}>
                    {car.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </div>

                <div style={{ padding: '20px', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--secondary)' }}>
                      {car.brand} {car.model}
                    </h3>
                    <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>
                      ${car.pricePerDay}<span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/day</span>
                    </span>
                  </div>

                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '12px' }}>
                    <MapPin size={14} /> {car.location} • {car.year}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', fontSize: '0.78rem', color: 'var(--text-muted)', backgroundColor: 'var(--bg-subtle)', padding: '8px', borderRadius: 'var(--radius-sm)' }}>
                    <div>{car.category}</div>
                    <div>{car.fuel_type}</div>
                    <div>{car.transmission}</div>
                  </div>
                </div>

                <div className="owner-car-actions-bar">
                  <button
                    onClick={() => handleToggleAvailability(car._id, car.isAvailable)}
                    className="btn btn-outline btn-sm"
                    style={{ fontSize: '0.8rem' }}
                  >
                    {car.isAvailable ? <ToggleRight size={18} color="var(--success)" /> : <ToggleLeft size={18} color="var(--text-muted)" />}
                    {car.isAvailable ? 'Available' : 'Set Active'}
                  </button>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <Link to={`/owner/edit-car/${car._id}`} className="btn btn-outline btn-sm">
                      <Edit3 size={14} /> Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteCar(car._id, `${car.brand} ${car.model}`)}
                      className="btn btn-danger btn-sm"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3 className="empty-state-title">No vehicles added yet</h3>
            <p className="empty-state-description">
              You haven't listed any cars on VeloceDrive yet. Add your first vehicle to start accepting rental bookings!
            </p>
            <Link to="/owner/add-car" className="btn btn-primary btn-lg">
              <PlusCircle size={18} /> List Your First Car
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
