# Deployment Instructions for Vercel

Refactored the application to be "Vercel-ready". The backend and frontend are now linked via environment configurations and Vercel rewriting rules.

## Prerequisites

1.  **Vercel Account**: You need an account on [vercel.com](https://vercel.com).
2.  **MongoDB Atlas**: Ensure you have a MongoDB connection string (URI) that is accessible from anywhere (0.0.0.0/0 allowed in Network Access).

## What was changed?

1.  **Unified Configuration**: Created `vercel.json` in the root. This tells Vercel how to build the frontend and backend side-by-side.
    *   Frontend builds as a static Angular app.
    *   Backend builds as Serverless Functions handling `/api/*` requests.
2.  **Dynamic Environment**:
    *   Locally: The frontend connects to `http://localhost:5000/api`.
    *   Production: The frontend connects to `/api` (relative path), which Vercel internally routes to your backend function.
3.  **CORS & Port Handling**: Updated `server.js` to work in a serverless environment and handle different origins.

## How to Deploy

### Option 1: Using the Vercel CLI (Recommended for first try)

1.  Open a terminal in the project root (`Admin-Dashboard`).
2.  Run `npx vercel login` if you haven't logged in.
3.  Run `npx vercel`.
    *   Set up and deploy? **Yes**
    *   Link to existing project? **No**
    *   Project Name: `admin-dashboard` (or similar)
    *   In which directory is your code located? **./**
    *   Auto-detected Project Settings? **Yes** (It should detect the `vercel.json`)
    *   *Important*: It might ask for Build settings. If `vercel.json` is correctly read, it shouldn't ask much.

4.  **Environment Variables**:
    *   During deployment (or in the Vercel Dashboard > Settings > Environment Variables), add:
        *   `MONGO_URI`: Your MongoDB connection string.
        *   `JWT_SECRET`: A secure secret key.
        *   `NODE_ENV`: `production`

### Option 2: Git Integration

1.  Push this code to a GitHub/GitLab/Bitbucket repository.
2.  Go to Vercel Dashboard -> "Add New..." -> "Project".
3.  Import your repository.
4.  **Environment Variables**: Add `MONGO_URI` and `JWT_SECRET` in the configuration step.
5.  Click **Deploy**.

## Troubleshooting

*   **Frontend 404s on refresh**: The `vercel.json` includes a rewrite rule `source: "/(.*)", destination: "/index.html"` which handles Angular routing.
*   **Backend errors**: Check the "Functions" logs in Vercel Dashboard for specific API errors.
*   **CORS**: If you see CORS errors, ensure your Vercel domain is whitelisted in `server.js` (we added a heuristic to allow `.vercel.app` domains automatically).
