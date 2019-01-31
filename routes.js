module.exports = app => {
  app.get("/api/sheets/:name", (req, res) => {
    console.log(req.params.name)
  })
  
  app.post("/api/sheets/:name/update", (req, res) => {
    console.log(req.params.name)
  })
}