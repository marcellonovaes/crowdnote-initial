
var fs = require('fs');
var express = require('express');
var app = express();
app.set('view engine', 'ejs');

var ip = require('ip').address();
var crypto = require('crypto');

var l = require('./util/lifo.js');
var f = require('./util/fifo.js');





//Microtask 1
var lifo = new f.FIFO();
var fifo = new l.LIFO();
var item;

//TESTE
for(var i=0; i<5; i++){
	fifo.push(i);
}
lifo.setItems(fifo.getItems());
fifo.clean();	

app.get('/', function(req, res) {
  res.render('index', {title: 'Job Distribution System'});
});

app.get('/microtask1', function(req, res) {

	var fingerprint = ip;
	fingerprint += req.headers['user-agent'];
	fingerprint = crypto.createHash('md5').update(fingerprint).digest("hex");

	var item = lifo.pop();
	fifo.push(item);

	if(lifo.isEmpty()){
		lifo.setItems(fifo.getItems());
		fifo.clean();	
	}

    	var bitmap = fs.readFileSync('data/test/'+item+'.jpg');
    	var image = new Buffer(bitmap).toString('base64');
	res.render('microtask1', {fingerprint: fingerprint , item:item , img: image});
});

app.listen(80);
