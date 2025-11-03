
LifeSwap — Deploy Guide (Frontend + Backend)
===========================================

Contents:
- frontend: React + Vite (static build)
- backend: Node + Express (mock API)

Local development:
1. Install dependencies:
   npm install
2. Run backend:
   node backend/index.js
3. Run frontend dev:
   npm run dev

Build:
- npm run build (frontend)
- Serve build with any static host.

Deploy to Vercel (frontend + serverless functions):
1. Push this repo to GitHub.
2. Go to https://vercel.com/new and import the repo.
3. Set build command: npm run build, output directory: dist
4. For backend endpoints, either:
   - Deploy backend as a separate Render service and set REACT_APP_API_URL to its URL
   - Or convert backend routes to Vercel Serverless Functions (api/)

Deploy backend to Render (free tier):
1. Push repo to GitHub.
2. Create a new Web Service on Render, connect to this repo, select backend directory '/backend'.
3. Build command: 'npm install' (Render will detect Node)
4. Start command: 'node backend/index.js'
5. Set environment variables if needed.

Itch.io:
- Build the frontend and upload the static site (zip of dist) as an HTML game.

Notes:
- To use a real LLM, set OPENAI_API_KEY and update frontend/backend to call the API securely from the backend.
