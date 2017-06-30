var express = require('express');
var app = express();
   
// Lista de Utilizadores
var users = [
  { id: 1, username: 'Manuel', email: 'manuel@examplo.com' },
  { id: 2, username: 'Maria', email: 'maria@examplo.com' }
];

//Endpoints
app.get('/', function(req, res) {
  res.send('Welcome to API');
});

app.get('/get_users', function(req, res, next) {
  res.send(users);
})

app.get('/test', function(req, res, next) {
  res.send('OK');
})

app.listen(80);
