const { verify } = require('jsonwebtoken')

const AppError = require('../utils/appError')
const authConfig = require('../configs/auth')

function ensureAuthenticated(req, res, next) {
  const authHeader = req.headers.authorization

  if(!authHeader) {
    throw new AppError('Jwt token não foi informado', 401)
  }

  const [, token] = authHeader.split(' ');

  try {
    const { sub: user_id } = verify(token, authConfig.jwt.secret)

    req.user = {
      id: Number(user_id)
    }

    return next()
  } catch(err) {
    throw new AppError('Jwt token está inválido', 401)
  }
}

module.exports = ensureAuthenticated