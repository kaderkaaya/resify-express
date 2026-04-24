<div align="center">
  <h1>🚀 resify-express</h1>
  <p><strong>The ultimate, elegant, and standardized response handler for Express.js APIs.</strong></p>

  [![npm version](https://img.shields.io/npm/v/resify-express.svg?style=flat-square)](https://www.npmjs.com/package/resify-express)
  [![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg?style=flat-square)](https://opensource.org/licenses/ISC)
  [![Node.js CI](https://img.shields.io/badge/Node.js-%3E%3D%2014.0.0-brightgreen.svg?style=flat-square)](https://nodejs.org/)
</div>

<br />

Stop writing repetitive `res.status(200).json(...)` and `res.status(500).json(...)` across your entire Express application. **resify-express** provides a clean, consistent, and beautiful way to handle API responses and errors.

## ✨ Features

- 🎯 **Standardized Responses**: Consistent JSON structure for both success and error responses.
- 🛠️ **Expressive Helpers**: Injects `.success()` and `.error()` directly into the Express `res` object.
- 🚨 **Custom Error Class**: Built-in `ApiError` class for throwing structured HTTP errors.
- 🛡️ **Global Error Handler**: Catch-all middleware to format unhandled exceptions beautifully.
- 🐛 **Developer Friendly**: Optional stack trace inclusion for development environments.
- 🪶 **Lightweight**: Zero dependencies (except Express peer dependency).

---

## 📦 Installation

Install the package using your favorite package manager:

```bash
npm install resify-express
# or
yarn add resify-express
# or
pnpm add resify-express
```

---

## 🚀 Quick Start

Here is a minimal example to get you up and running in seconds.

```javascript
const express = require("express");
const { attachHelpers, errorMiddleware, ApiError } = require("resify-express");

const app = express();
app.use(express.json());

// 1. Attach the response helpers (res.success, res.error)
app.use(attachHelpers);

// 2. Use the helpers in your routes
app.get("/users", (req, res) => {
  const users = [{ id: 1, name: "John Doe" }];
  
  // Beautiful success response
  return res.success(users, "Users fetched successfully", 200);
});

app.get("/users/:id", (req, res) => {
  const user = null; // Simulate not found

  if (!user) {
    // Throw structured errors easily
    throw new ApiError("User not found", 404, {
      code: "USER_NOT_FOUND",
      description: "No user exists with the provided ID",
    });
  }

  return res.success(user);
});

// 3. Add the global error middleware at the end
app.use(
  errorMiddleware({
    // Show stack traces only in development
    includeStack: process.env.NODE_ENV === "development", 
  })
);

app.listen(3000, () => console.log("Server running on port 3000 🚀"));
```

---

## 📖 API Reference

### 1. `attachHelpers` (Middleware)
Injects helper methods into the Express response (`res`) object.

#### `res.success(data, message, status)`
Sends a standardized success response.

- `data` *(any)*: The payload you want to return. Default: `null`.
- `message` *(string)*: A descriptive success message. Default: `"Success"`.
- `status` *(number)*: HTTP status code. Default: `200`.

**Output:**
```json
{
  "success": true,
  "message": "Users fetched successfully",
  "data": [{ "id": 1, "name": "John Doe" }]
}
```

#### `res.error(errorDetails, status, message)`
Sends a standardized error response manually.

- `errorDetails` *(object)*: Object containing `code`, `description`, or `error`.
- `status` *(number)*: HTTP status code. Default: `500`.
- `message` *(string)*: A descriptive error message. Default: `"Error"`.

**Output:**
```json
{
  "success": false,
  "message": "Validation Failed",
  "error": {
    "code": "INVALID_INPUT",
    "description": "Email is required"
  }
}
```

---

### 2. `ApiError` (Class)
A custom Error class designed specifically for HTTP APIs. When thrown, it is automatically caught and formatted by the `errorMiddleware`.

```javascript
throw new ApiError("Unauthorized Access", 401, {
  code: "AUTH_FAILED",
  description: "Invalid or expired token provided."
});
```

**Parameters:**
- `message` *(string)*: The main error message.
- `status` *(number)*: HTTP status code.
- `options` *(object)*: Additional details `{ code, description }`.

---

### 3. `errorMiddleware(options)`
A global Express error handler that catches `ApiError` instances and unhandled exceptions, formatting them into the standardized response structure.

**Options:**
- `includeStack` *(boolean)*: If `true`, includes the error stack trace in the response. **⚠️ Warning:** Only set this to `true` in development to avoid exposing sensitive internal logic in production.

**Example Output (Production):**
```json
{
  "success": false,
  "message": "User not found",
  "data": null,
  "error": {
    "code": "USER_NOT_FOUND",
    "description": "No user exists with the provided ID"
  }
}
```

**Example Output (Development with `includeStack: true`):**
```json
{
  "success": false,
  "message": "User not found",
  "data": null,
  "error": {
    "code": "USER_NOT_FOUND",
    "description": "No user exists with the provided ID",
    "stack": "ApiError: User not found\n    at /app/src/routes.js:42:11..."
  }
}
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/your-username/resify-express/issues).

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the **ISC License**.

---
<div align="center">
  Made with ❤️ for better Developer Experience
</div>
