const ArgumentError = require('./errors/ArgumentError')

const JwksClient = require('./JwksClient')

const handleSigningKeyError = (err, cb) => {
  if (err && err.name === 'SigningKeyNotFoundError') return cb(null)
  if (err) return cb(err)
}

module.exports = options => {
  if (options === null || options === undefined)
    throw new ArgumentError(
      'An options object must be provided when initializing expressJwtSecret'
    )

  const client = new JwksClient(options)
  const onError = handleSigningKeyError

  return function secretProvider(req, header, payload, cb) {
    if (!header || header.alg !== 'RS256') return cb(null, null)

    client.getSigningKey(header.kid, (err, key) => {
      if (err) return onError(err, newError => cb(newError, null))

      return cb(null, key.publicKey || key.rsaPublicKey)
    })
  }
}
