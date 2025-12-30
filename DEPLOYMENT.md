# Deployment Guide

This project is configured as a monorepo containing both the Angular frontend and the Express backend.

## Deployment Configuration

The project uses valid `package.json` in the root to orchestrate the deployment.

- **Build Command:** `npm run build`
  - This triggers the Angular build (`ng build`).
- **Start Command:** `npm start`
  - This starts the Node.js backend (`node server.js`), which serves the API and the static frontend files.

## Environment Variables

You must configure the following environment variables on your hosting provider (Render, Heroku, Railway, etc.):

```
NODE_ENV=production
PORT=5000 (or let the platform set it)
MONGO_URI=mongodb+srv://... (Your MongoDB connection string)
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=30d
```

## Local Development vs. Production

### Frontend
- **Development**: `ng serve` (via `npm start` in frontend) uses `proxy.conf.json` to forward `/api` requests to `localhost:5000`.
- **Production**: The Angular app uses relative paths (`/api/...`), so it automatically talks to the backend serving it.

### Backend
- **Development**: Runs on port 5000.
- **Production**: Serves the `frontend/dist/frontend/browser` folder as static files. All unknown routes are redirected to `index.html` to support Angular routing.

## Initial Setup (Data Seeding)

After deploying for the first time, you may want to seed the database with an initial admin user.
You can do this by running the seed script via the backend console or as a one-off command:
```bash
npm run seed --workspace=admin-dashboard-backend
```
