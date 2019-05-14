const setup = require('axios-cache-adapter').setup

const JwksError = require('@errors/JwksError')
const SigningKeyNotFoundError = require('@errors/SigningKeyNotFoundError')

const api = setup({
  baseUrl: 'https://machinemaker.auth0.com',
  cache: {
    maxAge: 60 * 60 * 1000
  }
})

module.exports = class JwksClient {
  constructor(options) {
    this.options = options
  }

  getJwks(cb) {
    api
      .get(this.options.jwksUri)
      .then(res => {
        let jwks = res.data.keys
        return cb(null, jwks)
      })
      .catch(err => {
        return cb(new JwksError(err))
      })
  }

  getSigningKeys(cb) {
    const callback = (err, keys) => {
      if (err) return cb(err)

      if (!keys || !keys.length) {
        return cb(new JwksError('The JWKS endpoint did not contain any keys'))
      }

      const signingKeys = keys
        .filter(
          key =>
            key.use === 'sig' &&
            key.kty === 'RSA' &&
            key.kid &&
            ((key.x5c && key.x5c.length) || (key.n && key.e))
        )
        .map(key => {
          return {
            kid: key.kid,
            nbf: key.nbf,
            publicKey: certToPEM(key.x5c[0])
          }
        })

      if (!signingKeys.length)
        return cb(new JwksError('The JWKS endpoint did not contain any keys'))

      return cb(null, signingKeys)
    }

    this.getJwks(callback)
  }

  getSigningKey(kid, cb) {
    const callback = (err, keys) => {
      if (err) return cb(err)

      const signingKey = keys.find(key => key.kid === kid)

      if (!signingKey)
        return cb(
          new SigningKeyNotFoundError(
            'Unable to find a signing key that matches'
          )
        )

      return cb(null, signingKey)
    }

    this.getSigningKeys(callback)
  }
}

function certToPEM(cert) {
  cert = cert.match(/.{1,64}/g).join('\n')
  cert = `-----BEGIN CERTIFICATE-----\n${cert}\n-----END CERTIFICATE-----\n`
  return cert
}
