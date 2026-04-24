const express = require("express");
const request = require("supertest");

const { attachHelpers, errorMiddleware, ApiError } = require("../src");

const buildApp = ({ includeStack = false } = {}) => {
  const app = express();
  app.use(express.json());
  app.use(attachHelpers);

  app.get("/user", (req, res) => {
    return res.success({ name: "Kader" }, "User fetched");
  });

  app.post("/users", (req, res) => {
    return res.success({ id: 1, ...req.body }, "Created", 201);
  });

  app.get("/users/:id", (req, res) => {
    throw new ApiError("User not found", 404, {
      code: "USER_NOT_FOUND",
      description: "User not found",
    });
  });

  app.get("/error", (req, res) => {
    return res.error({ description: "USER_NOT_FOUND", code: 103 });
  });

  app.get("/custom-error", (req, res) => {
    return res.error(
      { error: { fields: ["email"] } },
      422,
      "Validation failed",
    );
  });

  app.get("/boom", (req, res) => {
    throw new Error("unexpected");
  });

  app.use(errorMiddleware({ includeStack }));

  return app;
};

describe("Integration: attachHelpers + errorMiddleware", () => {
  describe("res.success", () => {
    it("GET /user should return 200 with success envelope", async () => {
      const res = await request(buildApp()).get("/user");

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        success: true,
        message: "User fetched",
        data: { name: "Kader" },
      });
    });

    it("POST /users should return 201 with created data", async () => {
      const res = await request(buildApp())
        .post("/users")
        .send({ name: "Kader" });

      expect(res.status).toBe(201);
      expect(res.body).toEqual({
        success: true,
        message: "Created",
        data: { id: 1, name: "Kader" },
      });
    });
  });

  describe("res.error", () => {
    it("GET /error should return 500 with default error envelope", async () => {
      const res = await request(buildApp()).get("/error");

      expect(res.status).toBe(500);
      expect(res.body).toEqual({
        success: false,
        message: "Error",
        error: { description: "USER_NOT_FOUND", code: 103 },
      });
    });

    it("GET /custom-error should allow a fully custom error payload", async () => {
      const res = await request(buildApp()).get("/custom-error");

      expect(res.status).toBe(422);
      expect(res.body).toEqual({
        success: false,
        message: "Validation failed",
        error: { fields: ["email"] },
      });
    });
  });

  describe("errorMiddleware + ApiError", () => {
    it("should handle a thrown ApiError with its status and metadata", async () => {
      const res = await request(buildApp()).get("/users/42");

      expect(res.status).toBe(404);
      expect(res.body).toEqual({
        success: false,
        message: "User not found",
        data: null,
        error: {
          code: "USER_NOT_FOUND",
          description: "User not found",
        },
      });
    });

    it("should handle a thrown generic Error as 500 Internal Server Error", async () => {
      const res = await request(buildApp()).get("/boom");

      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("unexpected");
      expect(res.body.data).toBeNull();
      expect(res.body.error).toEqual({
        code: null,
        description: null,
      });
    });

    it("should include stack in payload when includeStack: true", async () => {
      const res = await request(buildApp({ includeStack: true })).get("/boom");

      expect(res.status).toBe(500);
      expect(typeof res.body.error.stack).toBe("string");
      expect(res.body.error.stack).toContain("unexpected");
    });

    it("should omit stack by default", async () => {
      const res = await request(buildApp()).get("/boom");

      expect(res.body.error.stack).toBeUndefined();
    });
  });
});
