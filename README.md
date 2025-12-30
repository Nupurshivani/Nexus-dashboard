<div align="center">
  <img src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/nodejs/nodejs.png" alt="Node.js" width="60"/>
  <img src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/angular/angular.png" alt="Angular" width="60"/>
  <img src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/mongodb/mongodb.png" alt="MongoDB" width="60"/>
  <img src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/express/express.png" alt="Express" width="60"/>
</div>

<h1 align="center">🚀 Nexus Admin Dashboard</h1>

<p align="center">
  <strong>A sleek, modern admin dashboard built with the MEAN stack</strong>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-screenshots">Screenshots</a> •
  <a href="#-api-docs">API</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Angular-19-dd0031?style=for-the-badge&logo=angular" alt="Angular 19"/>
  <img src="https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js" alt="Node.js"/>
  <img src="https://img.shields.io/badge/MongoDB-7+-47A248?style=for-the-badge&logo=mongodb" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="TailwindCSS"/>
</p>

---

##  What's This?

Nexus is a production-ready admin dashboard I built to learn the MEAN stack properly. It's got everything you'd expect from a real admin panel - user management, analytics, orders tracking, activity logs, and a clean dark mode UI that doesn't hurt your eyes at 2 AM.

The whole thing is designed with a purple/cyan color scheme that looks pretty slick IMO. Dark mode only because let's be honest, who uses light mode anymore?

##  Features

### Dashboard & Analytics
- **Real-time Stats** - Users, revenue, orders, conversion rates - all at a glance
- **Interactive Charts** - Built with Chart.js, showing trends over 7/30/90 days
- **Device & Browser Breakdown** - Know where your traffic comes from

### User Management
- Full CRUD operations with role-based access
- Search, filter, and paginate through users
- Status toggling (active/inactive/pending)
- Department assignment

### Security
- JWT authentication with refresh tokens
- bcrypt password hashing (12 rounds)
- Rate limiting on auth endpoints
- Helmet.js security headers
- Role-based authorization (user/moderator/admin/superadmin)

### UI/UX
- Glassmorphism design elements
- Smooth animations and transitions
- Responsive sidebar (collapsible)
- Toast notifications
- Loading skeletons

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| **Frontend** | Angular 19, Tailwind CSS, Chart.js |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB + Mongoose |
| **Auth** | JWT (access + refresh tokens) |
| **Security** | Helmet, bcrypt, express-rate-limit |

## Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/admin-dashboard.git
cd admin-dashboard

# Backend
cd backend
npm install
cp .env.example .env  # add your MongoDB URI and JWT secret

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment

Create `backend/.env`:
```env
MONGO_URI=mongodb://localhost:27017/admin_dashboard
JWT_SECRET=your_super_secret_key_here
JWT_REFRESH_SECRET=another_secret_for_refresh_tokens
```

### 3. Seed Demo Data

```bash
cd backend
npm run seed
```

This creates:
- Admin account: `admin@dashboard.com` / `admin123`
- 20 sample users
- 50 orders
- 100 activity logs
- 31 days of analytics

### 4. Run

```bash
# Terminal 1 - Backend (port 5000)
cd backend && npm start

# Terminal 2 - Frontend (port 4200)
cd frontend && npm start
```

Open [http://localhost:4200](http://localhost:4200) 

## Project Structure

```
├── backend/
│   ├── middleware/     # Auth middleware
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API endpoints
│   ├── server.js       # Express app
│   └── seed-admin.js   # Database seeder
│
└── frontend/
    └── src/
        ├── app/
        │   ├── core/           # Services, guards
        │   ├── features/       # Feature modules
        │   ├── layout/         # Sidebar, header
        │   ├── dashboard/      # Main dashboard
        │   └── login/          # Auth page
        └── styles.css          # Global styles + Tailwind
```

##  API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Get tokens |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | Invalidate session |
| GET | `/api/auth/me` | Get current user |

### Admin (requires auth + admin role)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Dashboard statistics |
| GET | `/api/admin/chart-data` | Time-series data |
| GET | `/api/admin/distribution` | Pie chart data |
| GET | `/api/admin/users` | List users (paginated) |
| POST | `/api/admin/users` | Create user |
| PUT | `/api/admin/users/:id` | Update user |
| DELETE | `/api/admin/users/:id` | Delete user |
| GET | `/api/admin/orders` | List orders |
| GET | `/api/admin/activities` | Activity logs |
| GET | `/api/admin/notifications` | User notifications |

##  Color Palette

The UI uses a carefully picked dark theme:

| Color | Hex | Usage |
|-------|-----|-------|
| Background | `#0a0a0f` | Main bg |
| Surface | `#12121a` | Cards |
| Primary | `#8b5cf6` | Buttons, accents |
| Cyan | `#06b6d4` | Gradients |
| Success | `#10b981` | Positive indicators |
| Error | `#ef4444` | Destructive actions |

##  Future TODO

- [ ] Email verification
- [ ] Password reset flow  
- [ ] 2FA with authenticator apps
- [ ] Export data to CSV/Excel
- [ ] Dark/Light theme toggle
- [ ] WebSocket for real-time updates
- [ ] Docker compose setup

## 📄 License

MIT - do whatever you want with it.

---

<p align="center">
  Built with ☕ and late nights by <a href="https://github.com/Nupurshivani">Nupur Shivani</a>
</p>