const { successResponse, errorResponse } = require("./response");

const attachHelpers = (_, res, next) => {
  res.success = (data, message = "Success", status = 200) => {
    return successResponse(res, data, message, status);
  };

  res.error = (
    { code = null, description = null, error = null } = {},
    status = 500,
    message = "Error",
  ) => {
    return errorResponse(res, message, status, { code, description, error });
  };

  next();
};

module.exports = { attachHelpers };
