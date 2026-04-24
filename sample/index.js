const express = require("express");
const app = express();
const resifyExpress = require("../src/index.js");
app.use(express.json());
const http = require("http");
app.use(resifyExpress);

const server = http.createServer(app);

app.get("/user", (req, res) => {
  return res.success({ name: "Kader" }, "User fetched");
});

app.get("/error", (req, res) => {
  return res.error({ description: "USER_NOT_FOUND", code: 103 });
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
