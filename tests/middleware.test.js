const { attachHelpers } = require("../src/middleware");

const createMockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("attachHelpers middleware", () => {
  it("should call next() exactly once", () => {
    const res = createMockRes();
    const next = jest.fn();

    attachHelpers({}, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  it("should attach res.success and res.error as functions", () => {
    const res = createMockRes();
    const next = jest.fn();

    attachHelpers({}, res, next);

    expect(typeof res.success).toBe("function");
    expect(typeof res.error).toBe("function");
  });

  describe("res.success", () => {
    it("should send a 200 success payload by default", () => {
      const res = createMockRes();
      attachHelpers({}, res, jest.fn());

      res.success();

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Success",
        data: null,
      });
    });

    it("should forward data, message and status", () => {
      const res = createMockRes();
      attachHelpers({}, res, jest.fn());

      res.success({ id: 1 }, "Created", 201);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Created",
        data: { id: 1 },
      });
    });
  });

  describe("res.error", () => {
    it("should send a 500 error payload by default", () => {
      const res = createMockRes();
      attachHelpers({}, res, jest.fn());

      res.error();

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Error",
        error: { description: null, code: null },
      });
    });

    it("should forward code, description, status and message", () => {
      const res = createMockRes();
      attachHelpers({}, res, jest.fn());

      res.error(
        { code: "USER_NOT_FOUND", description: "User missing" },
        404,
        "Not Found",
      );

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Not Found",
        error: { description: "User missing", code: "USER_NOT_FOUND" },
      });
    });

    it("should forward an explicit error object", () => {
      const res = createMockRes();
      attachHelpers({}, res, jest.fn());

      const customError = { fields: ["email"] };

      res.error({ error: customError }, 422, "Validation failed");

      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Validation failed",
        error: customError,
      });
    });

    it("should not throw when called with no arguments", () => {
      const res = createMockRes();
      attachHelpers({}, res, jest.fn());

      expect(() => res.error()).not.toThrow();
    });
  });
});
