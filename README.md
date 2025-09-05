# 🚀 Centralized Logging System 

This repository contains a robust, structured, and centralized logging system for a Node.js Express application. It uses **Winston** for logging, **Prisma** for database interaction, and a custom logging module to provide a simple and powerful developer experience.



## ✨ Features

-   **📝 Structured Logging:** Logs are stored as structured data (JSON in files, specific columns in DB) for easy querying and analysis.
-   **📍 Centralized Control:** A single, smart logger module (`CustomLogger`) handles all logging logic.
-   **🗃️ Multiple Destinations:** Logs are automatically sent to the console, log files (`info.log`, `error.log`), and a MySQL database.
-   **🧑‍💻 Simple Developer API:** Developers use simple, one-argument methods like `myinfo('message')` and `myerror('message')`.
-   **🤖 Automatic API Error Handling:** A global middleware automatically catches, formats, and logs all unhandled API errors with rich context (method, route, stack trace).
-   **👤 User Context:** Automatically captures the logged-in user's ID for every log entry.
-   **⚡ Optimized for Performance:** Stack traces are shortened and logs are processed efficiently.

---

## 🗺️ Flow of the Logging System

Understanding how a log travels through the system is key to using it effectively.

### **1. Automatic API Errors (e.g., `throw new Error()`)**

This flow is for unexpected errors that are caught by our global error handler.

`API Request` → `Route throws Error` → **`errorHandler.js` Middleware**
1.  Catches the `Error` object.
2.  Creates an instance of our logger.
3.  Calls `customLogger.myerror(err, req)`.

→ **`CustomLogger.myerror()`**
1.  Detects it received a full `Error` object.
2.  Extracts `message`, `statusCode`, and shortens the `stack` trace.
3.  Gets the `userId` from the utility function.
4.  Packages everything into a structured object: `{ level, message, userId, method, route, statusCode, stack }`.

→ **Winston (`logger.js`)**
1.  Receives the structured log object.
2.  Sends it to all configured transports.

→ **Destinations**
-   Console (in color)
-   `error.log` and `combined.log` files
-   MySQL Database (via `PrismaTransport`)

### **2. Manual Logs (e.g., `myinfo()` or `myerror()`)**

This flow is for when a developer explicitly decides to log an event.

`API Request` → `Developer calls logger`
-   `customLogger.myinfo('User logged in.')`
-   `customLogger.myerror('Payment failed: Insufficient funds.')`

→ **`CustomLogger.myinfo()` or `myerror()`**
1.  Gets the `userId` from the utility function.
2.  Packages the log into a simple object: `{ level, message, userId }`.

→ **Winston (`logger.js`)**
1.  Receives the simple log object.
2.  Sends it to all configured transports.

→ **Destinations**
-   Console
-   `info.log` (for `myinfo`) or `error.log` (for `myerror`)
-   `combined.log`
-   MySQL Database

---



## ⚙️ Setup and Installation


A. .env setup
DATABASE_URL="mysql://YOUR_USER:YOUR_PASSWORD@localhost:3306/YOUR_DATABASE_NAME"
B. DB setup
 This command will:
 1. Create the database if it doesn't exist.
 2. Apply the schema from prisma/schema.prisma to create the Log table.
 3. Generate the Prisma Client.
npx prisma migrate dev
C. Start the Application


To log a successful event or general information, import `customLogger` and use the `myinfo()` method. It only takes a single string argument.

```javascript
// routes/someRoute.js
const customLogger = require('../utils/CustomLogger');

router.get('/user-profile', (req, res) => {
  customLogger.myinfo('User profile was accessed.');
  res.status(200).send('Profile data');
});
```
Logging "Forced" Errors
For business logic failures (e.g., invalid input), use the myerror() method with a simple string.

```
JavaScript

// routes/someRoute.js
const customLogger = require('../utils/CustomLogger');

router.post('/checkout', (req, res) => {
  const { paymentMethod } = req.body;

  if (!paymentMethod) {
    // This is a "forced" error. We log it and handle the response.
    customLogger.myerror('Checkout failed: Payment method was not provided.');
    return res.status(400).send('Payment method is required.');
  }

  // ... proceed with checkout
});
```

