var fs = require('fs');
var express = require('express');
var app = express();
app.set('view engine', 'ejs');

var f = require('./util/fifo.js');

//Microtask 1
var fifoA = new f.FIFO();
var fifoB = new f.FIFO();
var item;

//TESTE
for(var i=0; i<5; i++){
	fifoA.push(i);
}

app.get('/', function(req, res) {
  res.render('index', {title: 'Job Distribution System'});
});

app.get('/microtask1', function(req, res) {
	var item = fifoA.pop();
	fifoB.push(item);

	if(fifoA.isEmpty()){
		fifoA.setItems(fifoB.getItems());
		fifoB.clean();	
	}

    	var bitmap = fs.readFileSync('data/test/'+item+'.jpg');
    	var image = new Buffer(bitmap).toString('base64');
	res.render('microtask1', {item:item ,img: image});
});

app.listen(80);
