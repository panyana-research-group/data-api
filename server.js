const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors())

app.post('/api', (req, res) => {
  console.log(req)
  res.send({
    message: "Success"
  })
})

const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
