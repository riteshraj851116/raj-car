
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ShieldCheck,
  Zap,
  BadgeIndianRupee,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

import { CarCard } from '../components/CarCard.jsx';
import { api } from '../services/api.js';
import './Home.css';

export const Home = () => {
  const navigate = useNavigate();

  const [featuredCars, setFeaturedCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchKeyword, setSearchKeyword] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await api.get('/cars?isAvailable=true');

        const cars = Array.isArray(response.data)
          ? response.data
          : [];

        setFeaturedCars(cars.slice(0, 6));
      } catch (error) {
        console.error('Unable to load featured cars:', error);
        setFeaturedCars([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    const params = new URLSearchParams();

    if (searchKeyword.trim()) {
      params.set('search', searchKeyword.trim());
    }

    if (category) {
      params.set('category', category);
    }

    const query = params.toString();

    navigate(query ? `/cars?${query}` : '/cars');
  };

  const categories = [
    {
      name: 'SUV',
      icon: '🚙',
    },
    {
      name: 'Luxury',
      icon: '✦',
    },
    {
      name: 'Electric',
      icon: '⚡',
    },
    {
      name: 'Sports',
      icon: '🏁',
    },
    {
      name: 'Convertible',
      icon: '◈',
    },
    {
      name: 'Sedan',
      icon: '▱',
    },
  ];

  return (
    <main className="home-page">

      {/* HERO */}

      <section className="hero-section">
        <div className="container">
          <div className="hero-grid">

            <div className="hero-content">

              <div className="hero-badge">
                <Sparkles size={14} />
                <span>Hand-Picked Cars & Hassle-Free Rentals</span>
              </div>

              <h1 className="hero-title">
                DRIVE THE CAR
                <br />
                <span className="highlight-text">
                  YOU TRULY LOVE
                </span>
              </h1>

              <p className="hero-subtitle">
                Find a car that fits the trip, the mood, and the moment.
                Browse trusted vehicles, compare your options, and book
                your next drive without the usual rental hassle.
              </p>

              <form
                onSubmit={handleSearchSubmit}
                className="hero-search-card"
              >
                <div className="search-card-title">
                  Find your next ride
                </div>

                <div className="hero-search-grid">

                  <div
                    className="form-group"
                    style={{ margin: 0 }}
                  >
                    <label className="form-label">
                      Location or Brand
                    </label>

                    <input
                      type="text"
                      className="form-input"
                      placeholder="Try BMW, Tesla, Delhi..."
                      value={searchKeyword}
                      onChange={(event) =>
                        setSearchKeyword(event.target.value)
                      }
                    />
                  </div>

                  <div
                    className="form-group"
                    style={{ margin: 0 }}
                  >
                    <label className="form-label">
                      Car Type
                    </label>

                    <select
                      className="form-select"
                      value={category}
                      onChange={(event) =>
                        setCategory(event.target.value)
                      }
                    >
                      <option value="">
                        All Cars
                      </option>

                      <option value="SUV">
                        SUV
                      </option>

                      <option value="Luxury">
                        Luxury
                      </option>

                      <option value="Electric">
                        Electric
                      </option>

                      <option value="Sports">
                        Sports
                      </option>

                      <option value="Sedan">
                        Sedan
                      </option>

                      <option value="Convertible">
                        Convertible
                      </option>
                    </select>
                  </div>

                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  style={{ marginTop: '8px' }}
                >
                  <Search size={18} />
                  Search Cars
                </button>
              </form>

            </div>

            <div className="hero-image-wrapper">

              <img
                src="https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=85"
                alt="Premium BMW car"
                className="hero-image"
              />

              <div className="hero-image-overlay" />

              <div className="hero-image-info">
                <span className="hero-image-label">
                  Featured Drive
                </span>

                <strong>
                  BMW Performance Series
                </strong>
              </div>

            </div>

          </div>
        </div>
      </section>


      {/* FEATURED CARS */}

      <section className="section-padding">
        <div className="container">

          <div className="section-header">

            <span className="section-subtitle">
              Trending Rides
            </span>

            <h2 className="section-title">
              Cars Worth Taking Out
            </h2>

            <p className="section-desc">
              Explore some of the cars currently available for your
              next weekend escape, city run, or long drive.
            </p>

          </div>

          {loading ? (

            <div className="spinner-container">
              <div className="spinner" />

              <p
                style={{
                  marginTop: '12px',
                  color: 'var(--text-muted)',
                }}
              >
                Looking for available cars...
              </p>
            </div>

          ) : featuredCars.length > 0 ? (

            <>
              <div className="car-grid">
                {featuredCars.map((car) => (
                  <CarCard
                    key={car._id}
                    car={car}
                  />
                ))}
              </div>

              <div
                style={{
                  textAlign: 'center',
                  marginTop: '40px',
                }}
              >
                <Link
                  to="/cars"
                  className="btn btn-outline btn-lg"
                >
                  <span>
                    Explore All Cars
                  </span>

                  <ArrowRight size={18} />
                </Link>
              </div>
            </>

          ) : (

            <div className="empty-state">

              <p className="empty-state-title">
                No cars available right now
              </p>

              <p className="empty-state-description">
                New vehicles may be added soon. Check back later
                or list your own car if you are an owner.
              </p>

              <Link
                to="/register?role=owner"
                className="btn btn-primary"
                style={{ marginTop: '20px' }}
              >
                List Your Car
                <ArrowRight size={17} />
              </Link>

            </div>

          )}

        </div>
      </section>


      {/* CATEGORIES */}

      <section
        className="section-padding"
        style={{
          backgroundColor: 'var(--bg-subtle)',
        }}
      >
        <div className="container">

          <div className="section-header">

            <span className="section-subtitle">
              Pick Your Style
            </span>

            <h2 className="section-title">
              What Are You Driving?
            </h2>

            <p className="section-desc">
              From comfortable daily drivers to cars made for
              turning an ordinary trip into a proper road trip.
            </p>

          </div>

          <div className="categories-grid">

            {categories.map((categoryItem) => (

              <Link
                key={categoryItem.name}
                to={`/cars?category=${categoryItem.name}`}
                className="category-card"
              >

                <div className="category-icon-box">
                  {categoryItem.icon}
                </div>

                <span className="category-name">
                  {categoryItem.name}
                </span>

                <span className="category-explore">
                  Explore
                  <ArrowRight size={14} />
                </span>

              </Link>

            ))}

          </div>

        </div>
      </section>


      {/* WHY VELOCEDRIVE */}

      <section className="section-padding">

        <div className="container">

          <div className="section-header">

            <span className="section-subtitle">
              Why VeloceDrive
            </span>

            <h2 className="section-title">
              Rental, Without The Headache
            </h2>

            <p className="section-desc">
              Everything you need to get behind the wheel,
              without wasting time at a traditional rental counter.
            </p>

          </div>

          <div className="why-us-grid">

            <div className="feature-box">

              <div className="feature-icon-wrapper">
                <ShieldCheck size={30} />
              </div>

              <h3 className="feature-title">
                Trusted Cars
              </h3>

              <p className="feature-desc">
                Browse vehicles listed by verified owners and
                get the important details before making a booking.
              </p>

            </div>


            <div className="feature-box">

              <div className="feature-icon-wrapper">
                <Zap size={30} />
              </div>

              <h3 className="feature-title">
                Quick Booking
              </h3>

              <p className="feature-desc">
                Choose your dates, select a car, and send your
                booking request without unnecessary steps.
              </p>

            </div>


            <div className="feature-box">

              <div className="feature-icon-wrapper">
                <BadgeIndianRupee size={30} />
              </div>

              <h3 className="feature-title">
                Straightforward Pricing
              </h3>

              <p className="feature-desc">
                See the rental rate clearly before booking so
                you know what you are paying for your trip.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* OWNER CTA */}

      <section
        className="section-padding"
        style={{
          paddingTop: 0,
        }}
      >

        <div className="container">

          <div className="cta-banner">

            <div>

              <span className="section-subtitle">
                For Car Owners
              </span>

              <h2 className="cta-title">
                Your Car Could Be Earning While You’re Away
              </h2>

              <p className="cta-desc">
                Have a car that spends most of its time parked?
                Put it to work by sharing it with people looking
                for a reliable ride.
              </p>

            </div>

            <Link
              to="/register?role=owner"
              className="btn btn-secondary btn-lg"
            >
              <span>
                List Your Car
              </span>

              <ArrowRight size={18} />
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
};

