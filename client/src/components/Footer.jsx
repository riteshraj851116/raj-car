import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Heart } from 'lucide-react';
import './Footer.css';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col-brand">
            <div className="footer-logo">
              <Car style={{ color: '#3b82f6' }} />
              <span>VELOCE<span style={{ color: '#3b82f6' }}>DRIVE</span></span>
            </div>
            <p className="footer-desc">
              Your go-to rental platform for road trips, weekend getaways, and special occasions. Drive verified cars directly from local owners.
            </p>
          </div>

          <div>
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/cars">Browse All Cars</Link></li>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Create Account</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-title">Car Types</h4>
            <ul className="footer-links">
              <li><Link to="/cars?category=Electric">Electric & Hybrid</Link></li>
              <li><Link to="/cars?category=SUV">SUVs & Trucks</Link></li>
              <li><Link to="/cars?category=Luxury">Luxury Sedans</Link></li>
              <li><Link to="/cars?category=Sports">Sports Cars</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-title">For Owners</h4>
            <ul className="footer-links">
              <li><Link to="/register?role=owner">List Your Vehicle</Link></li>
              <li><Link to="/owner">Owner Dashboard</Link></li>
              <li><Link to="/owner/add-car">Add New Car</Link></li>
              <li><Link to="/owner/bookings">Manage Bookings</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} VeloceDrive Rentals. All rights reserved.</p>
          <p style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            Built with <Heart size={14} color="#ef4444" fill="#ef4444" /> for MERN Full-Stack Showcase
          </p>
        </div>
      </div>
    </footer>
  );
};
