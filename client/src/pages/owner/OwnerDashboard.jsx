import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api.js';
import toast from 'react-hot-toast';
import { Car, Calendar, DollarSign, PlusCircle, CheckCircle, ArrowRight } from 'lucide-react';
import './OwnerDashboard.css';

export const OwnerDashboard = () => {
  const [stats, setStats] = useState({
    totalCars: 0,
    availableCars: 0,
    totalBookings: 0,
    activeBookings: 0,
    totalRevenue: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, bookingsRes] = await Promise.all([
          api.get('/owner/stats'),
          api.get('/bookings/owner'),
        ]);
        setStats(statsRes.data);
        setRecentBookings(bookingsRes.data.slice(0, 5));
      } catch (err) {
        toast.error(err.userMessage || 'Failed to load owner dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
        <p style={{ marginTop: '12px', color: 'var(--text-muted)' }}>Loading owner statistics...</p>
      </div>
    );
  }

  return (
    <div className="owner-page">
      <div className="container">
        <div className="owner-header">
          <div>
            <h1 className="owner-title">Owner Management Dashboard</h1>
            <p style={{ color: 'var(--text-muted)' }}>
              Overview of your fleet performance, revenue earnings, and active rental bookings.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Link to="/owner/add-car" className="btn btn-primary">
              <PlusCircle size={18} />
              Add New Car
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
              <Car size={28} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{stats.totalCars}</span>
              <span className="stat-label">Total Fleet Cars</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ backgroundColor: '#ecfdf5', color: '#10b981' }}>
              <CheckCircle size={28} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{stats.availableCars}</span>
              <span className="stat-label">Available for Rent</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ backgroundColor: '#fffbeb', color: '#f59e0b' }}>
              <Calendar size={28} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{stats.totalBookings}</span>
              <span className="stat-label">Total Bookings</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ backgroundColor: '#f0fdf4', color: '#15803d' }}>
              <DollarSign size={28} />
            </div>
            <div className="stat-info">
              <span className="stat-value">${stats.totalRevenue}</span>
              <span className="stat-label">Total Revenue</span>
            </div>
          </div>
        </div>

        {/* Recent Bookings Section */}
        <div className="dashboard-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--secondary)' }}>
              Recent Fleet Reservations
            </h3>
            <Link to="/owner/bookings" className="btn btn-outline btn-sm">
              <span>View All Bookings</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {recentBookings.length > 0 ? (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Car Vehicle</th>
                    <th>Pickup - Return</th>
                    <th>Days</th>
                    <th>Total Revenue</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((b) => (
                    <tr key={b._id}>
                      <td>
                        <strong>{b.user?.name || 'Customer'}</strong>
                        <br />
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{b.user?.email}</span>
                      </td>
                      <td>
                        {b.car ? (
                          <strong>{b.car.brand} {b.car.model}</strong>
                        ) : (
                          'Vehicle'
                        )}
                      </td>
                      <td>
                        {b.pickupDate} → {b.returnDate}
                      </td>
                      <td>{b.totalDays} days</td>
                      <td style={{ fontWeight: 700, color: 'var(--primary)' }}>${b.totalPrice}</td>
                      <td>
                        <span className={`badge badge-${b.status}`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state" style={{ padding: '30px' }}>
              <p className="empty-state-title">No bookings received yet</p>
              <p className="empty-state-description">
                List more vehicles with competitive daily rates to attract customers.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
