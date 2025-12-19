var express = require("express");
var fs = require("fs");

var app = express();

app.use(express.static("public"));
app.listen(5000);

app.get('/', function(request, response) {
    response.sendFile('index.html', { root: __dirname});
});
