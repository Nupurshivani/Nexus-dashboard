# Admin Dashboard with Analytics & Reporting

This project is a full-stack **Admin Dashboard** built using the **MEAN stack (MongoDB, Express.js, Angular, Node.js)**.  
It provides secure admin authentication, real-time analytics, and data visualization through a clean and responsive UI.

The application simulates real-world admin panels used in **CRM systems, analytics platforms, and management dashboards**.

---

##  Features

###  Authentication & Security
- Admin login using email and password
- JWT-based authentication
- Role-protected dashboard routes
- Secure API access using Authorization headers

### Analytics Dashboard
- Displays key metrics:
  - Total Users
  - Active Users
  - Sales
- Real-time data fetched from backend APIs
- Interactive bar chart using **Chart.js**
- Scaled visualization for better readability

###  UI & UX
- Clean, sober, professional UI
- Fully responsive layout
- User-friendly login experience with error feedback
- Production-style dashboard cards and charts

---

## Tech Stack

### Frontend
- Angular (Standalone Components)
- TypeScript
- HTML & CSS
- Chart.js

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)

---

##  Project Structure

admin-dashboard/
│
├── backend/
│ ├── routes/
│ ├── models/
│ ├── middleware/
│ ├── server.js
│ ├── .env
│
├── frontend/
│ ├── src/app/
│ │ ├── login/
│ │ ├── dashboard/
│ │ ├── app.routes.ts
│ │
│ ├── angular.json
│
└── README.md


## ⚙️ Setup Instructions (Local)

### 1️⃣ Backend Setup

```bash
cd backend
npm install
Create a .env file inside the backend folder:

env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
Start backend server:

npm start
Backend runs on:
http://localhost:5000

Frontend Setup

cd frontend
npm install
ng serve
Frontend runs on:
http://localhost:4200

Sample Login (for testing)
Use credentials that exist in your MongoDB users collection.

Example:
Email: admin@example.com
Password: admin123