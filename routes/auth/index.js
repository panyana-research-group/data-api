const ManagementClient = require('auth0').ManagementClient

const users = require('./users')
const roles = require('./roles')

const management = new ManagementClient({
  domain: process.env.AUTH_DOMAIN,
  clientId: process.env.AUTH_CLIENT_ID,
  clientSecret: process.env.AUTH_CLIENT_SECRET
})

module.exports = app => {
  users(app, management)
  roles(app, management)
}
