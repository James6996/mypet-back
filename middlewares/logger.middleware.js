function loggerMiddleware(req, res, next) {
    console.log(`Endpoint: ${req.url} | Request date: ${new Date()}`)
  
    return next()
  }
  
  module.exports = loggerMiddleware