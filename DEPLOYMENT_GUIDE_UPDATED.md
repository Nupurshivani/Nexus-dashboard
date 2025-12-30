# Updated Deployment Guide for Separate URLs

Since you have two separate Vercel deployments (one for frontend, one for backend), follow these specific steps to ensure they work.

## 1. Backend Deployment (nexus-dashboard-lemon)

*   **Vercel Project Settings**:
    *   **Root Directory**: Set this to `backend`. (Very Important!)
    *   **Environment Variables**: Ensure `MONGO_URI` and `JWT_SECRET` are set.
*   **Verification**:
    *   Visit `https://nexus-dashboard-lemon.vercel.app/`
    *   You should now see: `{"msg": "Admin Dashboard API is running", ...}` instead of a 404 error.

## 2. Frontend Deployment (nexus-dashboard-frontend-eosin)

*   **Vercel Project Settings**:
    *   **Root Directory**: Set this to `frontend`. (Very Important!)
    *   **Build Command**: `ng build` (or `npm run build`)
    *   **Output Directory**: `dist/frontend/browser`
*   **Configuration**:
    *   We have already updated `src/environments/environment.prod.ts` to point to your backend URL: `https://nexus-dashboard-lemon.vercel.app/api`.
*   **Verification**:
    *   Visit `https://nexus-dashboard-frontend-eosin.vercel.app/`
    *   It should load the login page.
    *   Refresh the page to ensure the 404 error is gone (fixed by `frontend/vercel.json` rewrites).

## Summary of Fixes Applied

1.  **Backend 404 Fix**: Added a root route `/` to `server.js` so you can verify it's running. Added `backend/vercel.json` to correctly route requests.
2.  **Frontend 404 Fix**: Added `frontend/vercel.json` to handle Angular Single Page Application (SPA) routing (rewrites all requests to `index.html`).
3.  **Linkage Fix**: Hardcoded the Backend URL into the Frontend's production environment file so they can talk to each other.

**Action Required**: Push these changes to your git repository and Redeploy both projects in Vercel.
