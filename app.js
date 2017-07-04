
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

var jobsSchema, Jobs;
var microtasksSchema, Microtasks;
var datasetsSchema, Datasets;
var Schema = mongoose.Schema; 
var ObjectId = Schema.ObjectId;
compileSchemas();

Jobs.find({},function (err, Jobs) {
  	if (err) return console.error(err);

  	for(i=0; i < Jobs.length; i++){

  		loadDatasets(Jobs[i],i);

	}

}).sort({order: 1});

function compileSchemas(){

	jobsSchema = Schema({
   	 	_id: ObjectId,
    		order: Number,
    		objective: String,
    		instruction: String,
	});
	Jobs = mongoose.model('Jobs', jobsSchema);

	microtasksSchema = Schema({
   	 	_id: ObjectId,
    		order: Number,
    		workflow: String,
    		media_type: String,
    		contribution_type: Number,
		minConvergence: Number,
		closed: Boolean
	});
	Microtasks = mongoose.model('Microtasks', microtasksSchema);

	datasetsSchema = Schema({
	    	_id: ObjectId,
    		job: ObjectId,
    		mime: String,
    		name: String,
    		converged: Boolean,
    		mode: String
	});
	Datasets = mongoose.model('Datasets', datasetsSchema);
}

function loadDatasets(Job,id){

	lifos[id] = new util.LIFO();
	fifos[id] = new util.FIFO();

	Datasets.find({job: Job._id},function (err, Datasets) {
  		if (err) return console.error(err);

		lifos[id].setItems(Datasets.reverse());

	});





}

app.get('/', function(req, res) {
  res.render('index', {title: 'Job Distribution System'});
});

//Local Scope - isolated run
app.get('/job0', function(req, res) {


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
		lifos[id].setItems(fifos[id].getItems().reverse());
		fifos[id].clean();	
	}

	res.render('595ab2f9aa17790e267ad712', {fingerprint: fingerprint , item:item, form:item.job, name:item.name, mime:item.mime});


});

app.listen(80);
