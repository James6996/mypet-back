function isAuthenticated(req, _res, next) {
  if (req.user) {
    next()
  } else {
    const error = new Error('Forbidden route! You need to be logged in!')
    error.code = 401
    next(error)
  }
}

function isBasicRole(req, _res, next) {
  if (req.user.role === 'basic') {
    return next()
  } else {
    const error = new Error('Forbidden route! You need to be a basic user!')
    error.code = 401
    return next(error)
  }
}

function isCareTakerRole(req, _res, next) {
  if (req.user.role === 'caretaker') {
    next()
  } else {
    const error = new Error('Forbidden route! You need to be a caretaker user!')
    error.code = 401
    return next(error)
  }
}

function isAdminRole(req, res, next) {
  if (req.user.role === 'admin') {
    return next()
  }
  const error = new Error('YOU SHALL NOT PASS')
  error.code = 401
  return next(error)
}

// function isCurrentUser(req, _res, next) {
//   if (String(req.user._id) === req.params.userId) {
//     return next()
//   } else {
//     const error = new Error('Forbidden')
//     error.code = 403
//     return next(error)
//   }
// }

module.exports = {
  isAuthenticated,
  isBasicRole,
  isCareTakerRole,
  // isCurrentUser,
  isAdminRole,
}
