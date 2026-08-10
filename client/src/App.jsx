import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext.jsx';
import { Navbar } from './components/Navbar.jsx';
import { Footer } from './components/Footer.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';

import { Home } from './pages/Home.jsx';
import { Cars } from './pages/Cars.jsx';
import { CarDetails } from './pages/CarDetails.jsx';
import { Login } from './pages/Login.jsx';
import { Register } from './pages/Register.jsx';
import { MyBookings } from './pages/MyBookings.jsx';

import { OwnerDashboard } from './pages/owner/OwnerDashboard.jsx';
import { OwnerCars } from './pages/owner/OwnerCars.jsx';
import { AddEditCar } from './pages/owner/AddEditCar.jsx';
import { OwnerBookings } from './pages/owner/OwnerBookings.jsx';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-container">
          <Toaster 
            position="top-right" 
            toastOptions={{
              duration: 3500,
              style: {
                borderRadius: '8px',
                background: '#0f172a',
                color: '#fff',
                fontSize: '0.9rem',
              },
            }}
          />
          <Navbar />
          
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/cars" element={<Cars />} />
              <Route path="/cars/:id" element={<CarDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Renter Protected Routes */}
              <Route 
                path="/my-bookings" 
                element={
                  <ProtectedRoute>
                    <MyBookings />
                  </ProtectedRoute>
                } 
              />

              {/* Owner Protected Routes */}
              <Route 
                path="/owner" 
                element={
                  <ProtectedRoute requireOwnerRole={true}>
                    <OwnerDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/owner/cars" 
                element={
                  <ProtectedRoute requireOwnerRole={true}>
                    <OwnerCars />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/owner/add-car" 
                element={
                  <ProtectedRoute requireOwnerRole={true}>
                    <AddEditCar />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/owner/edit-car/:id" 
                element={
                  <ProtectedRoute requireOwnerRole={true}>
                    <AddEditCar />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/owner/bookings" 
                element={
                  <ProtectedRoute requireOwnerRole={true}>
                    <OwnerBookings />
                  </ProtectedRoute>
                } 
              />

              {/* Catch-all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}
