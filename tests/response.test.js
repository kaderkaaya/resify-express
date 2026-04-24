const { successResponse, errorResponse } = require("../src/response");

const createMockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("successResponse", () => {
  it("should default to status 200 with null data and 'Success' message", () => {
    const res = createMockRes();

    successResponse(res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Success",
      data: null,
    });
  });

  it("should include the provided data and message", () => {
    const res = createMockRes();

    successResponse(res, { name: "Kader" }, "User fetched");

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "User fetched",
      data: { name: "Kader" },
    });
  });

  it("should respect a custom status code", () => {
    const res = createMockRes();

    successResponse(res, { id: 1 }, "Created", 201);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Created",
      data: { id: 1 },
    });
  });

  it("should return the result of res.json chain", () => {
    const res = createMockRes();

    const result = successResponse(res, { ok: true });

    expect(result).toBe(res);
  });
});

describe("errorResponse", () => {
  it("should default to status 500 with 'Error' message and empty error object", () => {
    const res = createMockRes();

    errorResponse(res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Error",
      error: { description: null, code: null },
    });
  });

  it("should build error from code and description when no explicit error is given", () => {
    const res = createMockRes();

    errorResponse(res, "Not Found", 404, {
      code: "NOT_FOUND",
      description: "Resource missing",
    });

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Not Found",
      error: { description: "Resource missing", code: "NOT_FOUND" },
    });
  });

  it("should prefer the provided 'error' value over code/description", () => {
    const res = createMockRes();
    const customError = { reason: "custom", extra: 42 };

    errorResponse(res, "Failure", 400, {
      code: "IGNORED",
      description: "ignored",
      error: customError,
    });

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Failure",
      error: customError,
    });
  });

  it("should work when called without an options object", () => {
    const res = createMockRes();

    errorResponse(res, "Oops", 400);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Oops",
      error: { description: null, code: null },
    });
  });
});
