
// ---------------------- Includes and Globals ------------------------

var host = 'localhost';
var http = require('http');
var path = require('path');
var fs = require('fs');
var express = require('express');
var app = express();
app.set('view engine', 'ejs');

var bodyParser = require('body-parser')

var util = require('./util/util.js');
var lifos = new Array();
var fifos = new Array();
var Fingerprint = new util.Fingerprint();

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/db');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('openUri', function() {});

var jobsSchema, Jobs;
var microtasksSchema, Microtasks;
var datasetsSchema, Dataset;
var contributionsSchema, Contributions;
var Schema = mongoose.Schema; 
var ObjectId = Schema.ObjectId;
var Timestamp = Schema.Timestamp;


// ---------------------  Init Functions -----------------------------

compileSchemas();
loadDatasets();
app.use( bodyParser.json() );      
app.use(bodyParser.urlencoded({ extended: true })); 

//-----------------------  Endpoints   -------------------------------

// Homepage
app.get('/', function(req, res) {
  res.render('index', {title: 'Job Distribution System'});
});


//----------------------------- Jobs ----------------------------------

// Job 0
var Job_0 = require('./jobs/595ab2f9aa17790e267ad712.js');
Job_0 = new Job_0.job_595ab2f9aa17790e267ad712(Fingerprint, Jobs, Contributions, lifos, fifos, host);
app.get('/jobs/0',Job_0.show);
app.post('/jobs/0',Job_0.save);

//------------------------ Aggragation --------------------------------

//Job 0
app.get('/aggregation/0',function(req, res) {

var Contributions_0;
var Contributions_1;

getDataset();

function getDataset(){
	Dataset.find({},function (err, Dataset) {
		if (err) return console.error(err);
		getContributions(Dataset);
	}).sort({_id: 1});
}


function getContributions(Dataset){
	Contributions.find({microtask : '5956e7825d39ebf26fb71ee0'},function (err, Contributions) {
		if (err) return console.error(err);
		processContributions(Dataset,Contributions);
	}).sort({date: 1});
}


function processContributions(Dataset,Contributions){
/*
	var items = new Array();
	for(var i=0; i < Dataset.length; i++){
		items[Dataset[i]._id] = {'info':{'name':Dataset[i].name, 'start':Dataset[i].start}, contributions: new Array()};
	}
	
	var contributions = new Array();
	for(var i=0; i < Contributions_0.length; i++){
		var microtask = Contributions_0[i].microtask;
		var item = items[Contributions_0[i].item].info;
		var contrib = Contributions[i].contribution;
		var instant = Contributions[i].instant;
		contributions[i] = {'microtask':microtask, 'item':Contributions_0[i].item, 'start':item.start, 'c0':c0, 'c1':c1};
	}

	for(var i=0; i <  contributions.length; i++){
		var contribution = contributions[i];
		items[contribution.item].contributions.push(contribution);
	}

	var points = new Array();
	for(var i=0; i < Dataset.length; i++){
		 var list = items[Dataset[i]._id].contributions.sort(function(a,b) {
							var x = parseInt(a.c0, 10);
							var y = parseInt(b.c0, 10);
							if(x > y) 	return 1;
							else		return -1;
						});

		var current = new Array();
		current.push(list[0]);

		for(var j=1; j < list.length; j++){
			var it = list[j];

			if( parseFloat(it.c0) - parseFloat(current[0].c0) < 1){
				current.push(it);
			}else{
				points.push(current);
				current = new Array();
				current.push(it);
			}

		}
		points.push(current);
	}

	var idx=0;
	for(var i=0; i < points.length; i++){
		var totalTime=0;
		var sugestions = points[i];
		for(var j=0; j < sugestions.length; j++){
			var sugestion = sugestions[j];
			totalTime += parseFloat(sugestion.c0);
		}
		var start = totalTime / sugestions.length;
		console.log('#Microtask:'+sugestion.microtask);
		console.log('Start: '+start);
		for(var j=0; j < sugestions.length; j++){
			var sugestion = sugestions[j];
			console.log('#'+idx+':'+sugestion.c1);
			idx++;
		}
		console.log('---------------');
	}
*/

/*
	var values = {};
	values.log = current;

	res.render('aggregation/'+item.job, values);
*/
	
}

	

});



// ----------------------   File Services -----------------------------

app.get('/scripts', function(req, res) {
	var name = req.query.name;
	var mime = req.query.mime;
	var path = 'util/'+name+'.'+mime; 
	fs.readFile(path, function (err, data){
		res.setHeader('content-type', 'text/javascript');
		res.end(data);
   	});
});

app.get('/dataset', function(req, res) {

	var dir = req.query.job;
	var name = req.query.name;
	var mime = req.query.mime;
	var start = req.query.start;
	var stop = req.query.stop;
	var path = 'data/'+dir+'/'+name+'-'+start+'-'+stop+'.'+mime;
	fs.readFile(path, function (err, data){
		res.writeHead(200, {"Content-Type":"video/"+mime});
       		res.end(data);
   	});
});

// ------------- Database Functions ------------------------------

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
    		job: ObjectId,
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
		start: Number,
		stop: Number,
    		converged: Boolean,
    		mode: String
	});
	Dataset = mongoose.model('Datasets', datasetsSchema);

	contributionsSchema = Schema({
    		microtask: ObjectId,
    		item: ObjectId,
    		contribution: String,
    		instant: String,
		date : Date,
		fingerprint: String 
	});
	Contributions = mongoose.model('Contributions', contributionsSchema);

}

function loadDatasets(){
	Jobs.find({},function (err, Jobs) {
  		if (err) return console.error(err);

  		for(i=0; i < Jobs.length; i++){

  			loadDataset(Jobs[i],i);

		}

	}).sort({order: 1});
}

function loadDataset(Job,id){

	lifos[id] = new util.LIFO();
	fifos[id] = new util.FIFO();

	Dataset.find({job: Job._id},function (err, Dataset) {
  		if (err) return console.error(err);

		lifos[id].setItems(Dataset.reverse());

	});
}

// Exec as sudo to run in port 80
app.listen(80);
