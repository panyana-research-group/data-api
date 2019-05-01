module.exports = (app, management) => {
  app.get('/auth/users/:id', (req, res) => {
    if (req.params.id === 'all') {
      management
        .getUsers()
        .then(response => {
          res.status(200).send(response)
        })
        .catch(err => {
          console.error(err)
          res.status(500).send(err)
        })
    } else {
      management
        .getUser({ id: req.params.id })
        .then(response => {
          res.status(200).send(response)
        })
        .catch(err => {
          console.error(err)
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
        console.error(err)
        res.status(500).send(err)
      })
  })

  app.post('/auth/users/:id/editroles', (req, res) => {
    management.getUserRoles({ id: req.params.id }).then(response => {
      const promises = []
      const addRoles = []
      const removeRoles = []

      for (const r of req.body.roles)
        if (!response.find(role => role.id === r)) addRoles.push(r)
      for (const r of response)
        if (!req.body.roles.find(role => role === r.id)) removeRoles.push(r.id)

      if (addRoles.length === 0 && removeRoles.length === 0)
        return res.status(200).send('NO CHANGE')
      if (addRoles.length > 0)
        promises.push(
          management.assignRolestoUser(
            { id: req.params.id },
            { roles: addRoles }
          )
        )
      if (removeRoles.length > 0)
        promises.push(
          management.removeRolesFromUser(
            { id: req.params.id },
            { roles: removeRoles }
          )
        )
      Promise.all(promises)
        .then(responses => {
          res.status(200).send(responses)
        })
        .catch(err => {
          res.status(500).send(err)
          console.error(err)
        })
    })
  })
}
