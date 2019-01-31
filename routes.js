const sheets = {
  lore: {
    id: "1ThxEY2LC8Rg9WUd53aWXrpe8wsprnEwVyFLKb6QFf0k"
  }
}

module.exports = app => {
  app.get("/api/sheets/:name", (req, res) => {
    if (!sheets[req.params.name]) {
      res.status(500).json({ error: "Not a valid sheet name" })
    }
    console.log(req.params.name)
  })
  
  app.post("/api/sheets/:name/update", (req, res) => {
    console.log(req.params.name)
  })
}