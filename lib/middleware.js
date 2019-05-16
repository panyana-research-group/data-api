const jwt = require('jsonwebtoken')
const async = require('async')
const set = require('lodash.set')

const UnauthorizedError = require('@errors/UnauthorizedError')

module.exports.auth = options => {
  let secretCallback = options.secret

  let middleware = (req, res, next) => {
    if (
      (req.method !== 'PUT' &&
        req.method !== 'POST' &&
        !req.path.startsWith('/auth')) ||
      req.path.startsWith('/calcs')
    )
      return next()

    let authHeader = req.headers.authorization
    let parts = authHeader.split(' ')
    if (parts.length !== 2) {
      throw new Error('credentials_required', {
        message: 'No authorization token was found'
      })
    }

    let scheme = parts[0]
    if (!/^Bearer$/i.test(scheme)) {
      throw new Error('credentials_bad_scheme', {
        message: 'Format is Authorization: Bearer [token]'
      })
    }

    let token = parts[1]
    let decodedToken = jwt.decode(token, { complete: true })
    if (!decodedToken) return res.status(401).send('INVALID TOKEN')

    if (decodedToken.header.alg !== 'RS256')
      return res.status(500).send('ONLY SUPPORT RS256')

    let tasks = [
      function getSecret(callback) {
        secretCallback(req, decodedToken.header, decodedToken.payload, callback)
      },
      function verifyToken(secret, callback) {
        jwt.verify(token, secret, options, function(err, decoded) {
          if (err) callback(new UnauthorizedError('invalid_token', err))
          else callback(null, decoded)
        })
      }
    ]

    async.waterfall(tasks, (err, result) => {
      if (err) return res.status(401).send('UNAUTHORIZED')
      set(req, 'user', result)
      next()
    })
  }

  return middleware
}
