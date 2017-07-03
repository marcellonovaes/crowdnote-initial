
var fs = require('fs');
var express = require('express');
var app = express();
app.set('view engine', 'ejs');

var ip = require('ip').address();
var crypto = require('crypto');

var util = require('./util.js');
var lifos = new Array();
var fifos = new Array();

//Database - MongoDb
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/db');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('openUri', function() {});

var microtasksSchema, Microtasks;
var datasetsSchema, Datasets;
var Schema = mongoose.Schema; 
var ObjectId = Schema.ObjectId;
compileSchemas();

Microtasks.find({},function (err, Microtasks) {
  	if (err) return console.error(err);

  	for(i=0; i < Microtasks.length; i++){

  		loadDataset(Microtasks[i],i);

	}

}).sort({order: 1});

function compileSchemas(){

	microtasksSchema = Schema({
   	 	_id: ObjectId,
    		project: Number,
    		order: Number,
    		objective: String,
    		instruction: String,
    		media_type: String,
    		contribution_type: String,
		minConvergence: Number
	});
	Microtasks = mongoose.model('Microtasks', microtasksSchema);

	datasetsSchema = Schema({
	    	_id: ObjectId,
    		microtask: ObjectId,
    		mime: String,
    		name: String,
    		converged: Boolean,
    		mode: String
	});
	Datasets = mongoose.model('Datasets', datasetsSchema);
}

function loadDataset(Microtask,id){

	lifos[id] = new util.LIFO();
	fifos[id] = new util.FIFO();

	Datasets.find({microtask: Microtask._id},function (err, Datasets) {
  		if (err) return console.error(err);

		lifos[id].setItems(Datasets);


	}).sort({name: 1});

}


function printItems(){

  	for(i=0; i < lifos.length; i++){
		console.log(lifos[i].getItems());
	}

}



app.get('/', function(req, res) {
  res.render('index', {title: 'Job Distribution System'});
});


//Local Scope - isolated run
app.get('/microtask0', function(req, res) {


	var id = 0;
	var fingerprint = ip;
	fingerprint += req.headers['user-agent'];
	fingerprint = crypto.createHash('md5').update(fingerprint).digest("hex");

	//Buscar na base de contributions pelo Fingerprint, somente IDs das imagens

	var item = lifos[id].pop();

	//Se o item aparecer na lista acima, ele volta pra pilha (repete enquanto)


	//Se o worker ainda nao contribuiu naquele item, seue em frente e ele vai pra fila
	fifos[id].push(item);

	if(lifos[id].isEmpty()){
		lifos[id].setItems(fifos[id].getItems());
		fifos[id].clean();	
	}

    	var bitmap = fs.readFileSync('data/'+item.microtask+'/'+item.name+'.'+item.mime);
    	var image = new Buffer(bitmap).toString('base64');
	res.render('microtask1', {fingerprint: fingerprint , item:item._id , img: image});


});

app.listen(80);
