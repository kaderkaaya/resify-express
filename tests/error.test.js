const { ApiError } = require("../src/error");

describe("ApiError", () => {
  it("should be an instance of Error and ApiError", () => {
    const err = new ApiError();

    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(ApiError);
  });

  it("should use default values when no arguments are passed", () => {
    const err = new ApiError();

    expect(err.message).toBe("Error");
    expect(err.status).toBe(500);
    expect(err.code).toBeNull();
    expect(err.description).toBeNull();
    expect(err.name).toBe("ApiError");
  });

  it("should set message and status correctly", () => {
    const err = new ApiError("User not found", 404);

    expect(err.message).toBe("User not found");
    expect(err.status).toBe(404);
    expect(err.code).toBeNull();
    expect(err.description).toBeNull();
  });

  it("should set code and description from options", () => {
    const err = new ApiError("Bad request", 400, {
      code: "BAD_REQUEST",
      description: "The request is invalid",
    });

    expect(err.message).toBe("Bad request");
    expect(err.status).toBe(400);
    expect(err.code).toBe("BAD_REQUEST");
    expect(err.description).toBe("The request is invalid");
  });

  it("should accept partial options object", () => {
    const err = new ApiError("Oops", 418, { code: "TEAPOT" });

    expect(err.code).toBe("TEAPOT");
    expect(err.description).toBeNull();
  });

  it("should not break when options is omitted", () => {
    expect(() => new ApiError("msg", 400)).not.toThrow();
  });

  it("should capture a stack trace", () => {
    const err = new ApiError("with stack", 500);

    expect(typeof err.stack).toBe("string");
    expect(err.stack).toContain("ApiError");
  });

  it("should be throwable and catchable", () => {
    expect(() => {
      throw new ApiError("boom", 500, { code: "BOOM" });
    }).toThrow(ApiError);

    try {
      throw new ApiError("boom", 500, { code: "BOOM" });
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError);
      expect(err.code).toBe("BOOM");
    }
  });
});
