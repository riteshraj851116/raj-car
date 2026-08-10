# VeloceDrive

A full-stack car rental application built with React, Express, MongoDB and JWT authentication. Users can browse cars and make reservations, while owners can manage vehicles and booking status from a separate dashboard.

## Features

- Car search and filters
- Car details and rental date selection
- Booking conflict checks
- User registration and login
- Owner dashboard with fleet and booking management
- Add, edit, delete and availability controls for cars
- Optional ImageKit uploads
- Local in-memory data fallback when MongoDB is not configured

## Stack

- React + Vite
- Plain CSS
- Express + Node.js
- MongoDB + Mongoose
- JWT + bcryptjs
- Axios

## Run locally

1. Install Node.js 18 or newer.
2. Copy `.env.example` to `.env`.
3. Add your MongoDB URI if you want persistent data. The app can also run without MongoDB.
4. Install packages:

   `npm install`

5. Start the app:

   `npm run dev`

6. Open `http://localhost:3000`.

### Demo accounts

- Renter: `user@demo.com` / `password123`
- Owner: `owner@carrental.com` / `password123`

## Production build

`npm run build`

Then start the Express server with `npm start`.

## API overview

- `/api/auth` - registration, login and current user
- `/api/cars` - car listing and owner car management
- `/api/bookings` - reservations and status updates
- `/api/owner/stats` - owner dashboard statistics
- `/api/upload` - optional ImageKit upload endpoint
