const errorMiddleware = ({ includeStack = false } = {}) => {
  return (err, req, res, next) => {
    const status = err.status || 500;

    return res.status(status).json({
      success: false,
      message: err.message || "Internal Server Error",
      data: null,
      error: {
        code: err.code || null,
        description: err.description || null,
        stack: includeStack ? err.stack : undefined,
        // hata olduğunda stack trace gösterilir yani hata yapıldığında nerede hata yapıldığını gösterir.
        // bu sayede hata yapıldığında nerede hata yapıldığını görebiliriz. (development ortamında)
        // includeStack: process.env.NODE_ENV === "development",
        // burda development yapıyoruz çünkü production ortamında yaparsak
        // clinette
        //"stack": "at getUser (/services/user.js:12:5)..."
        // bu sekilde gösterilir.
        // burda dosya pathlerini, proje yapısını ve internal logici expose ederiz bu yüzden production ortamında yapıyoruz.
      },
    });
  };
};

module.exports = { errorMiddleware };
