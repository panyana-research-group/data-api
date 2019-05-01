const ManagementClient = require('auth0').ManagementClient

const management = new ManagementClient({
  domain: process.env.AUTH_DOMAIN,
  clientId: process.env.AUTH_CLIENT_ID,
  clientSecret: process.env.AUTH_CLIENT_SECRET
})

module.exports = app => {
  app.get('/auth/users/:id', (req, res) => {
    if (req.params.id === 'all') {
      management
        .getUsers()
        .then(response => {
          res.status(200).send(response)
        })
        .catch(err => {
          console.log(err)
          res.status(500).send(err)
        })
    } else {
      management
        .getUser({ id: req.params.id })
        .then(response => {
          res.status(200).send(response)
        })
        .catch(err => {
          res.status(500).send(err)
        })
    }
  })

  app.get('/auth/users/:id/roles', (req, res) => {
    management
      .getUserRoles({ id: req.params.id })
      .then(response => {
        res.status(200).send(response)
      })
      .catch(err => {
        res.status(500).send(err)
      })
  })
}
