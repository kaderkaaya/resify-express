const { successResponse, errorResponse } = require("./response");

const attachHelpers = (_, res, next) => {
  res.success = (data, message, status) => {
    return successResponse(res, data, message, status);
  };

  res.error = (data, message, status, error) => {
    return errorResponse(res, data, message, status, error);
  };

  next();
};

module.exports = { attachHelpers };
