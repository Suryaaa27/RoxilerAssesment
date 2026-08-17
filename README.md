Roxiler Assessment - Store Rating Application

This is a full-stack web application developed for the Roxiler Systems intern coding challenge. It allows users to register, log in, search for stores, and give ratings.

Technologies Used
Frontend: React, Vite, Tailwind CSS, React Router, Axios
Backend: Node.js, Express.js
Database: MySQL, Sequelize
Authentication: JWT, bcryptjs
Features
User
Register and log in
Search stores by name or address
Give ratings from 1 to 5
Update their own ratings
Store Owner
View their stores
Check average ratings
See users who rated their stores
Admin
View total users, stores, and ratings
Add users and assign roles
Add stores and assign them to store owners
How to Run
Prerequisites
Node.js
MySQL
Backend

Go to the backend folder:

cd backend
npm install

Create a .env file inside the backend folder:

PORT=5000
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=root
DB_NAME=store_rating_db
DB_DIALECT=mysql
JWT_SECRET=supersecretjwtkey12345!

Start the backend:

npm run dev

The required database tables will be created automatically by Sequelize.

Frontend

Open another terminal and run:

cd frontend
npm install
npm run dev

Then open:

http://localhost:5173
Admin Login

To create the default admin account, run this from the backend folder:

node seedAdmin.js

Email: admin@gmail.com
Password: admin1234@
