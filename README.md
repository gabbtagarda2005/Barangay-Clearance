# Barangay Clearance Portal

The project has a React/Vite frontend in `frontend/` and an Express/MongoDB API in `backend/`.

## Run locally

1. Copy `backend/.env.example` to `backend/.env` and set `MONGO_URI` and a private `JWT_SECRET`.
2. In one terminal, run `npm install` and `npm start` from `backend/`.
3. In another terminal, run `npm install` and `npm run dev` from `frontend/`.
4. Open the Vite URL (normally `http://localhost:5173`). The Vite development proxy sends `/api` requests to the local API.

Do not commit `.env` files or use the sample database URL or JWT secret in production.

## Deploy the API to Render

1. Push this project to a Git provider and create a Render **Blueprint** from the repository. The root `render.yaml` configures the API service.
2. Set `MONGO_URI` to a production MongoDB connection string and `JWT_SECRET` to a newly generated, private random value in Render.
3. After the frontend has a URL, set `CLIENT_ORIGIN` to that exact origin (for example `https://your-site.vercel.app`). Separate multiple allowed origins with commas.
4. Wait for the `/health` check to pass and note the Render service URL.

## Deploy the frontend to Vercel

1. Import the same repository into Vercel and set the project **Root Directory** to `frontend`.
2. Use `npm run build` as the build command and `dist` as the output directory.
3. Add the build-time environment variable `VITE_API_URL` with the Render API URL followed by `/api` (for example `https://your-service.onrender.com/api`).
4. Deploy, then update Render's `CLIENT_ORIGIN` with the Vercel production URL and redeploy the API if needed.

The Vercel rewrite configuration supports direct navigation to frontend routes. Set `CLIENT_ORIGIN` to include any Vercel preview origins that need API access.

Public registration creates resident accounts only. To create a trusted staff or administrator account, add `BOOTSTRAP_USER_NAME`, `BOOTSTRAP_USER_EMAIL`, `BOOTSTRAP_USER_PASSWORD`, and optionally `BOOTSTRAP_USER_ROLE` to `backend/.env`, then run `npm run seed` from `backend/`. The command creates one account, refuses to overwrite an existing account, and never deletes users. Remove the bootstrap values after use.

Profile images are stored on the API filesystem. Render's default filesystem is ephemeral, so use persistent storage or an object-storage service before relying on profile uploads in production.
