const express = require("express");
const go = require("gojs");
var path = require('path');

const app = express()
console.log("OK")

app.get('/', (request, response) => {
    response.sendFile(path.join(__dirname + '/start.html'));
});

app.get('/style.css', function(req, res) {
  res.sendFile(__dirname + "/" + "style.css");
});
app.get('/AddModule.js', function(req, res) {
  res.sendFile(__dirname + "/" + "AddModule.js");
});
app.get('/go.js', function(req, res) {
  res.sendFile(__dirname + "/" + "gojs-lib/go.js");
});
app.listen(3000, () => {console.log(`App available on http://localhost:3000`)})
