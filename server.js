var express = require('express');
var app = express();
var port = 3000;

//Use the route to define in routes.js
var routes = require('./routes.js');
app.use('/', routes);

app.listen(port,function() {
    console.log('Server started on port '+ port); 
 });
