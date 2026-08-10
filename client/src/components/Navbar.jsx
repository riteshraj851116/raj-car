import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
LogOut,
LayoutDashboard,
PlusCircle,
Calendar,
Menu,
X,
Shield,
ArrowUpRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import './Navbar.css';

export const Navbar = () => {
const { user, logout, isOwner } = useAuth();
const navigate = useNavigate();
const location = useLocation();
const [mobileOpen, setMobileOpen] = useState(false);

const handleLogout = () => {
logout();
toast.success('Logged out successfully');
navigate('/login');
setMobileOpen(false);
};

const isActive = (path) => location.pathname === path;

const closeMobile = () => {
setMobileOpen(false);
};

return ( <nav className="navbar"> <div className="navbar-container">


    <Link to="/" className="navbar-brand" onClick={closeMobile}>
      <span className="brand-main">VELOCE</span>
      <span className="brand-drive">DRIVE</span>
    </Link>

    <ul className={`navbar-menu ${mobileOpen ? 'open' : ''}`}>

      <li>
        <Link
          to="/"
          className={`nav-link ${isActive('/') ? 'active' : ''}`}
          onClick={closeMobile}
        >
          Home
        </Link>
      </li>

      <li>
        <Link
          to="/cars"
          className={`nav-link ${isActive('/cars') ? 'active' : ''}`}
          onClick={closeMobile}
        >
          Browse Cars
        </Link>
      </li>

      {user && !isOwner && (
        <li>
          <Link
            to="/my-bookings"
            className={`nav-link ${isActive('/my-bookings') ? 'active' : ''}`}
            onClick={closeMobile}
          >
            <Calendar size={16} />
            My Bookings
          </Link>
        </li>
      )}

      {isOwner && (
        <>
          <li>
            <Link
              to="/owner"
              className={`nav-link ${isActive('/owner') ? 'active' : ''}`}
              onClick={closeMobile}
            >
              <LayoutDashboard size={16} />
              Dashboard
            </Link>
          </li>

          <li>
            <Link
              to="/owner/cars"
              className={`nav-link ${isActive('/owner/cars') ? 'active' : ''}`}
              onClick={closeMobile}
            >
              Manage Cars
            </Link>
          </li>

          <li>
            <Link
              to="/owner/add-car"
              className={`nav-link ${isActive('/owner/add-car') ? 'active' : ''}`}
              onClick={closeMobile}
            >
              <PlusCircle size={16} />
              Add Car
            </Link>
          </li>

          <li>
            <Link
              to="/owner/bookings"
              className={`nav-link ${isActive('/owner/bookings') ? 'active' : ''}`}
              onClick={closeMobile}
            >
              Car Bookings
            </Link>
          </li>
        </>
      )}

      <li className="navbar-actions">
        {user ? (
          <>
            <div className="user-profile-badge">
              <div className="user-avatar">
                {user.name?.charAt(0).toUpperCase()}
              </div>

              <div className="user-info">
                <span className="user-name">{user.name}</span>

                <span className="user-role">
                  {isOwner ? (
                    <>
                      <Shield size={11} />
                      Owner
                    </>
                  ) : (
                    'Renter'
                  )}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="logout-btn"
            >
              <LogOut size={15} />
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="login-btn"
              onClick={closeMobile}
            >
              Login
            </Link>

            <Link
              to="/register"
              className="register-btn"
              onClick={closeMobile}
            >
              Get Started
              <ArrowUpRight size={15} />
            </Link>
          </>
        )}
      </li>
    </ul>

    <button
      className="mobile-toggle"
      onClick={() => setMobileOpen(!mobileOpen)}
      aria-label="Toggle Navigation"
    >
      {mobileOpen ? <X size={24} /> : <Menu size={24} />}
    </button>

  </div>
</nav>


);
};
