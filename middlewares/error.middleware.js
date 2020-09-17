// eslint-disable-next-line no-unused-vars
function errorMiddleware(err, req, res, next) {
  res.status(err.code || 500).json({
    message: err.message || 'Unexpected error',
  })
}

module.exports = errorMiddleware
