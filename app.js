
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

//Database - MongoDb
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

var listJobs;

compileSchemas();
loadDatasets();
app.get('/', function(req, res) {
  res.render('index', {title: 'Job Distribution System'});
});


app.use( bodyParser.json() );      

app.use(bodyParser.urlencoded({ extended: true })); 

app.get('/scripts', function(req, res) {
	var name = req.query.name;
	var mime = req.query.mime;
	var path = 'util/'+name+'.'+mime; 
	fs.readFile(path, function (err, data){
		//res.writeHead(200, {"Content-Type":"text/plain"});
       		//res.end(data);
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

//Local Scope - isolated run
app.get('/jobs/595ab2f9aa17790e267ad712',show_595ab2f9aa17790e267ad712);

app.post('/jobs/595ab2f9aa17790e267ad712',save_595ab2f9aa17790e267ad712);


//Job 0 - Microtasks 0 and 1
function save_595ab2f9aa17790e267ad712(req, res) {
	var item = req.body.item;
	var fingerprint = req.body.fingerprint;
  	var m0_id = req.body.m0_id;
  	var m0_contrib = req.body.m0_contrib;
 	var m1_id = req.body.m1_id;
  	var m1_contrib = req.body.m1_contrib;

	var c0 = new Contributions({'item':item , 'microtask':m0_id , 'contribution':m0_contrib, 'date': new Date(), 'fingerprint':fingerprint });
	var c1 = new Contributions({'item':item , 'microtask':m1_id , 'contribution':m1_contrib, 'date': new Date(), 'fingerprint':fingerprint });

	c0.save(function (err, m0) {if (err) return console.error(err);});

	c1.save(function (err, m1) {if (err) return console.error(err);});


	show_595ab2f9aa17790e267ad712(req, res);
}

function show_595ab2f9aa17790e267ad712(req, res) {

	var id = 0;
	var tmp = new Array();
	var fingerprint = Fingerprint.get(req);


	Microtasks.find({job : listJobs[0]._id},function (err, Microtasks) {
		if (err) return console.error(err);

		Contributions.find({fingerprint: fingerprint},function (err, Contributions) {
			if (err) return console.error(err);

			//Already contributed for all items
			if(Contributions.length/2 == lifos[id].getItems().length + fifos[id].getItems().length){
				res.render('finish', {});
				return null;
			}

			//Find an item witch didn't recieve contribution from this user
			var item = lifos[id].pop();
			var did = true;
			while(did){
				if(lifos[id].isEmpty()){
					var items = fifos[id].getItems().sort(function(a,b) {
												var x = parseInt(a._id, 10);
												var y = parseInt(b._id, 10);
												if(x > y) 	return -1;
												else		return 1;
											});
					lifos[id].setItems(items);
					fifos[id].clean();	
				}
				var did = false;
				for(var i=0; i < Contributions.length; i++){
					if(Contributions[i].item.toString('utf-8').trim() == item._id.toString('utf-8').trim()){
						tmp.push(item);
						item = lifos[id].pop();
						did = true;
						break;
					}
				}
			}
			//empilha de novo os que ja tinham recebido contribuicao deste user
			tmp = tmp.reverse();
			for(var i=0; i < tmp.length; i++){
				lifos[id].push(tmp[i]);
			}
			lifos[id].setItems(lifos[id].getItems());
			fifos[id].push(item);

			var values = {};
			values.fingerprint = fingerprint;
			var dir = item.job;
			var name = item.name;
			var mime = item.mime;
			var start = item.start;
			var stop = item.stop;

			var path = 'data/'+dir+'/'+name+'-'+start+'-'+stop+'.'+mime;
			var vbin = fs.readFileSync(path);
			var v64 = new Buffer(vbin).toString('base64');
			values.v64 = v64;

			values.host = host;
			values.item = item;
			values.item_id = item._id;
			values.job = item.job;
			values.name = item.name;
			values.mime = item.mime;
			values.start = item.start;
			values.stop = item.stop;

			values.m0_id = Microtasks[0]._id;
			values.m1_id = Microtasks[1]._id;

			values.instruction = listJobs[id].instruction;

			res.render('jobs/'+item.job, values);

		}).sort({_id: -1});
	});

}


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
		listJobs = Jobs;

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


app.listen(80);
