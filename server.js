const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json())
app.use(cors())

app.post('/api', (req, res) => {
  console.log(req.body)
  res.send({
    message: "Success"
  })
})

const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
