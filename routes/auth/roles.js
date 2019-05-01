module.exports = (app, management) => {
  app.get('/auth/roles/:id', (req, res) => {
    if (req.params.id === 'all') {
      management
        .getRoles()
        .then(response => {
          res.status(200).send(response)
        })
        .catch(err => {
          console.error(err)
          res.status(500).send(err)
        })
    } else {
      management
        .getRole({ id: req.params.id })
        .then(response => {
          res.status(200).send(response)
        })
        .catch(err => {
          console.error(err)
          res.status(500).send(err)
        })
    }
  })

  app.get('/auth/roles/:id/users', (req, res) => {
    management
      .getUsersInRole({ id: req.params.id })
      .then(response => {
        res.status(200).send(response)
      })
      .catch(err => {
        console.error(err)
        res.status(500).send(err)
      })
  })
}
