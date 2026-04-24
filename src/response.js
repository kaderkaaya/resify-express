const successResponse = (res, data = null, message = "Success", status = 200) => {
  return res.status(status).json({
    success: true,
    message,
    data,
    error: null,
  });
};

const errorResponse = (res, data = null, message = "Error", status = 500, error = null) => {
  return res.status(status).json({
    success: false,
    message,
    data,
    error,
  });
};

module.exports = { successResponse, errorResponse };