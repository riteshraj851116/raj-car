import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
  User,
  Mail,
  Lock,
  UserRound,
  CarFront,
  ArrowRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import './Login.css';

export const Register = () => {
  const [searchParams] = useSearchParams();

  const initialRole =
    searchParams.get('role') === 'owner' ? 'owner' : 'user';

  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState(initialRole);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const user = await register(
        name,
        email,
        password,
        confirmPassword,
        role
      );

      toast.success('Account created successfully!');

      if (user.role === 'owner') {
        navigate('/owner');
      } else {
        navigate('/');
      }
    } catch (err) {
      toast.error(err.userMessage || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">

          <div className="auth-header">
            <div className="auth-logo">
              <CarFront size={22} />
            </div>

            <div className="auth-brand">
              VELOCE<span>DRIVE</span>
            </div>

            <h1>Create Account</h1>

            <p>
              Join VeloceDrive and start your journey
            </p>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label className="form-label">
                Full Name
              </label>

              <div className="auth-input-wrapper">
                <User size={18} />

                <input
                  type="text"
                  className="form-input auth-input"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Email Address
              </label>

              <div className="auth-input-wrapper">
                <Mail size={18} />

                <input
                  type="email"
                  className="form-input auth-input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Account Type
              </label>

              <div className="role-selector">

                <button
                  type="button"
                  className={`role-option ${
                    role === 'user' ? 'selected' : ''
                  }`}
                  onClick={() => setRole('user')}
                >
                  <UserRound size={20} />

                  <span>
                    <strong>Renter</strong>
                    <small>Rent a car</small>
                  </span>
                </button>

                <button
                  type="button"
                  className={`role-option ${
                    role === 'owner' ? 'selected' : ''
                  }`}
                  onClick={() => setRole('owner')}
                >
                  <CarFront size={20} />

                  <span>
                    <strong>Owner</strong>
                    <small>List your car</small>
                  </span>
                </button>

              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Password
              </label>

              <div className="auth-input-wrapper">
                <Lock size={18} />

                <input
                  type="password"
                  className="form-input auth-input"
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Confirm Password
              </label>

              <div className="auth-input-wrapper">
                <Lock size={18} />

                <input
                  type="password"
                  className="form-input auth-input"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading ? (
                'Creating Account...'
              ) : (
                <>
                  Create Account
                  <ArrowRight size={18} />
                </>
              )}
            </button>

          </form>

          <div className="auth-footer">
            Already have an account?{' '}
            <Link to="/login">
              Sign in
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};