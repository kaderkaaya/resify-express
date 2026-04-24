const { errorMiddleware } = require("../src/error-middleware");
const { ApiError } = require("../src/error");

const createMockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("errorMiddleware", () => {
  it("should be a factory that returns a 4-arg express middleware", () => {
    const mw = errorMiddleware();

    expect(typeof mw).toBe("function");
    expect(mw.length).toBe(4);
  });

  it("should default to status 500 and 'Internal Server Error' for plain Error", () => {
    const mw = errorMiddleware();
    const res = createMockRes();
    const next = jest.fn();

    mw(new Error(), {}, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Internal Server Error",
      data: null,
      error: {
        code: null,
        description: null,
        stack: undefined,
      },
    });
  });

  it("should use err.status, err.message, err.code, err.description from ApiError", () => {
    const mw = errorMiddleware();
    const res = createMockRes();
    const err = new ApiError("User not found", 404, {
      code: "USER_NOT_FOUND",
      description: "The user does not exist",
    });

    mw(err, {}, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "User not found",
      data: null,
      error: {
        code: "USER_NOT_FOUND",
        description: "The user does not exist",
        stack: undefined,
      },
    });
  });

  it("should omit stack by default", () => {
    const mw = errorMiddleware();
    const res = createMockRes();

    mw(new Error("boom"), {}, res, jest.fn());

    const payload = res.json.mock.calls[0][0];
    expect(payload.error.stack).toBeUndefined();
  });

  it("should include stack when includeStack: true", () => {
    const mw = errorMiddleware({ includeStack: true });
    const res = createMockRes();
    const err = new Error("boom");

    mw(err, {}, res, jest.fn());

    const payload = res.json.mock.calls[0][0];
    expect(typeof payload.error.stack).toBe("string");
    expect(payload.error.stack).toContain("Error: boom");
  });

  it("should not call next()", () => {
    const mw = errorMiddleware();
    const res = createMockRes();
    const next = jest.fn();

    mw(new Error("x"), {}, res, next);

    expect(next).not.toHaveBeenCalled();
  });

  it("should honor err.status even for non-ApiError errors", () => {
    const mw = errorMiddleware();
    const res = createMockRes();
    const err = Object.assign(new Error("Bad"), { status: 400 });

    mw(err, {}, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json.mock.calls[0][0].message).toBe("Bad");
  });
});
