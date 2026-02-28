Project structure for Personal Expense Tracker

backend/
  server/
    index.js                 # Express server entry
    package.json             # Backend dependencies & scripts
    .env                    # Environment variables (not committed)
    controller/              # Route handlers and controllers
      categorycontroller.js
      CategoryRoutes.js
      forgotpassword.js
      login.js
      register.js
      transactioncontroller.js
      transactionrouter.js
      user.js
    middlwares/              # Middleware and auth
      authMiddleware.js
      googleAuth.js
      models/
        category.js
        Transaction.js
        User.js
    utils/
      generateToken.js
      getConnection.js        # DB connection helper
      testMongo.js

frontend/
  package.json               # top-level (not used by Vite app)
  expense-tracker/           # Vite React app
    index.html
    package.json             # app scripts and deps
    src/                     # React source files
      App.jsx
      main.jsx
      components/
      pages/
      util/
    public/

Notes:
- The backend server listens on `process.env.PORT` and requires `MONGO_URL`.
- The Vite app runs on port 5173 by default and expects the backend at http://localhost:5050.
- Keep any `.env` files out of version control. Commit a `.env.example` instead.
