const success = (res, data = null, message = "Success", status = 200) => {
  return res.status(status).json({
    success: true,
    message,
    data,
    error: null,
  });
};

const error = (res, data = null, message = "Error", status = 500) => {
  return res.status(status).json({
    success: false,
    message,
    data,
    error,
  });
};

module.exports = { success, error };