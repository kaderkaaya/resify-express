const express = require("express");
const app = express();
const { attachHelpers, errorMiddleware, ApiError } = require("../src/index.js");
app.use(express.json());
const http = require("http");
app.use(attachHelpers);

const server = http.createServer(app);

app.get("/user", (req, res) => {
  return res.success({ name: "Kader" }, "User fetched");
});

app.get("/users/:id", (req, res) => {
  const user = null;

  if (!user) {
    throw new ApiError("User not found", 404, {
      code: "USER_NOT_FOUND",
      description: "User not found",
    });
  }

  return res.success(user);
});

app.get("/error", (req, res) => {
  return res.error({ description: "USER_NOT_FOUND", code: 103 });
});

app.use(
  errorMiddleware({
    includeStack: process.env.NODE_ENV === "development",
  }),
);

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
