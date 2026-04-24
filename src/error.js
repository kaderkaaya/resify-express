class ApiError extends Error {
  constructor(
    message = "Error",
    status = 500,
    { code = null, description = null } = {},
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.description = description;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = { ApiError };
