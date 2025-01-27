var express = require("express");
var fs = require("fs");

var app = express();
app.listen(5000);

app.get('/', function(request, response) {
    response.sendFile('index.html', { root: __dirname});
});

app.get('/files/:name', function(request, response) {
    response.sendFile(request.params.name, { root: __dirname});
});