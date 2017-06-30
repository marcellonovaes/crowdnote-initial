var express = require('express');
var app = express();

f = require('./fifo.js');
l = require('./lifo.js');  
var fifo = new f.FIFO();
var lifo = new l.LIFO();
var item;

//Endpoints
app.get('/', function(req, res) {
  res.send('Job Distribution System');
});

app.get('/get_users', function(req, res, next) {
  res.send(users);
})

app.get('/lifo', function(req, res, next) {
	res.send('LIFO: '+lifo.getItems());
})

app.get('/lifo/push', function(req, res, next) {
	if(req.query.item){
		lifo.push(req.query.item);
	}
	res.send('LIFO: '+lifo.getItems());
})

app.get('/lifo/pop', function(req, res, next) {
	item = lifo.pop();
	res.send(item);
})

app.get('/fifo', function(req, res, next) {
	res.send('FIFO: '+fifo.getItems());
})

app.get('/fifo/push', function(req, res, next) {
	if(req.query.item){
		fifo.push(req.query.item);
	}
	res.send('FIFO: '+fifo.getItems());
})

app.get('/fifo/pop', function(req, res, next) {
	item = fifo.pop();
	res.send(item);
})

app.get('/switch', function(req, res, next) {
	lifo.setItems(fifo.getItems());
	fifo.clean();
	res.send('LIFO: '+lifo.getItems());
})


app.listen(80);
