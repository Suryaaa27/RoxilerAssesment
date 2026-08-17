# Roxiler Assessment - Store Rating Application

A full-stack web application built for the Roxiler Systems intern coding challenge. This application allows users to register, log in, search for stores, and submit ratings. It includes distinct role-based dashboards for Users, Store Owners, and Administrators.

## Tech Stack

*   **Frontend:** React, Vite, TailwindCSS, React Router, React Hook Form, Axios
*   **Backend:** Node.js, Express.js
*   **Database:** MySQL, Sequelize ORM
*   **Authentication:** JSON Web Tokens (JWT) & bcryptjs

## Features

### Role-Based Access Control
The application supports three distinct user roles, each with their own protected dashboards:

1.  **Normal User (USER)**
    *   Register and log in securely.
    *   Search for stores by name or address.
    *   Submit a rating (1-5 stars) for any store.
    *   Modify their own previously submitted ratings.
2.  **Store Owner (OWNER)**
    *   View a dashboard listing only the stores they own.
    *   See the average rating for their stores.
    *   View a list of all users who have rated their stores, including their names, emails, and individual ratings.
3.  **System Administrator (ADMIN)**
    *   Access a comprehensive administrative dashboard.
    *   View global statistics (Total Users, Total Stores, Total Ratings).
    *   Add new users to the system (and assign their roles).
    *   Add new stores and assign them to specific Store Owners.

## Getting Started

### Prerequisites
*   Node.js installed
*   MySQL installed and running locally

### Backend Setup
1. Navigate to the backend directory: 
   ```bash
   cd backend
   ```
2. Install dependencies: 
   ```bash
   npm install
   ```
3. Configure the environment variables. Ensure the `backend/.env` file exists and has the correct database password:
   ```env
   PORT=5000
   DB_HOST=127.0.0.1
   DB_USER=root
   DB_PASSWORD=root
   DB_NAME=store_rating_db
   DB_DIALECT=mysql
   JWT_SECRET=supersecretjwtkey12345!
   ```
4. Start the backend server: 
   ```bash
   npm run dev
   ```
   *(The Sequelize models will automatically sync and create the required tables).*

### Frontend Setup
1. Navigate to the frontend directory: 
   ```bash
   cd frontend
   ```
2. Install dependencies: 
   ```bash
   npm install
   ```
3. Start the frontend development server: 
   ```bash
   npm run dev
   ```
4. Access the application in your browser at `http://localhost:5173`.

## Default Admin Credentials
To access the Admin Panel immediately, you can seed the default admin account into your database:
1. From the `backend` directory, run: 
   ```bash
   node seedAdmin.js
   ```
2. Log in using the following credentials:
   *   **Email:** `admin@gmail.com`
   *   **Password:** `admin1234@`
