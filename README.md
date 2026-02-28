# Personal Expense Tracker

Simple expense tracker (backend + Vite React frontend).

Prerequisites
- Node.js (16+) and npm
- A MongoDB URI

Quick setup (local)

1) Backend

```bash
cd backend/server
npm install
# create .env with at least:
# PORT=5050
# MONGO_URL=your_mongo_connection_string
# Optional for Google OAuth:
# GOOGLE_CLIENT_ID=...
# GOOGLE_CLIENT_SECRET=...
npm run start  # uses nodemon as defined in package.json
```

2) Frontend (dev)

```bash
cd frontend/expense-tracker
npm install
npm run dev
# Open http://localhost:5173
```

Environment example (`backend/server/.env.example`)

```
PORT=5050
MONGO_URL=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/dbname
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

How to upload this project to GitHub (full steps)

1. Create a new repository on GitHub (via web UI or `gh`):

   - On the web: click New Repository, name it (e.g., `personal-expense-tracker`).
   - Or with GitHub CLI:

```bash
gh repo create your-username/personal-expense-tracker --public --source=. --remote=origin
```

2. Locally initialize and push (if not already a git repo):

```bash
# from repo root
git init
# optional: create .gitignore to ignore node_modules, .env, .env.local, .DS_Store
echo "node_modules/\nbackend/server/.env\nfrontend/expense-tracker/node_modules/\n.vscode/\n.DS_Store" > .gitignore
git add .
git commit -m "Initial commit"
git branch -M main
# Add remote (replace <URL> with the GitHub repo URL)
git remote add origin <URL>
git push -u origin main
```

Notes & best practices
- Do NOT commit real secrets. Use `backend/server/.env.example` for examples.
- Add a `.gitignore` (see above) to omit `node_modules` and `.env` files.
- If the repo already exists remotely, set the `origin` remote to its URL.

Troubleshooting
- If `npm run start` fails, ensure `nodemon` is installed (it's listed as a dependency in backend `package.json`).
- If the frontend can't reach the backend, check CORS origin and ports in `backend/server/index.js`.

Questions?
If you want, I can:
- create a `.env.example` file under `backend/server` and a `.gitignore` for you now;
- run `npm install` for backend and/or frontend in this workspace.
