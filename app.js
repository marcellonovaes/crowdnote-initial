
// ---------------------- Includes and Globals ------------------------

var host = 'localhost';
var http = require('http');
var path = require('path');
var fs = require('fs');
var express = require('express');
var app = express();
app.set('view engine', 'ejs');

var bodyParser = require('body-parser')

var util = require('./lib/util.js');
var fingerprint = new util.Fingerprint();

var database = require('./lib/database.js');
var dao = new database.DAO();
var dataset;
dao.loadDataset(function (d){ init(d); });

var activeTask = 0;
var input;

// ---------------------  Init Functions -----------------------------
app.use( bodyParser.json() );      
app.use(bodyParser.urlencoded({ extended: true }));

function init(d){
	dataset = d;
	dao.loadInput(activeTask, function (i){ initTask(i); });	
}

function initTask(i){
	input = i;	
}
 

//-----------------------  Endpoints   -------------------------------

// Homepage / Active Task
app.get('/', function(req, res) {
	var t = require('./tasks/task_'+activeTask+'.js');
	task = new t.task();
	task.show(res,dataset,fingerprint.get(req),host,input,activeTask);
});

app.post('/', function(req, res) {
	dao.store(req.body.item_id, activeTask, req.body.instant, req.body.contrib, req.body.fingerprint, function(){
		var t = require('./tasks/task_'+activeTask+'.js');
		task = new t.task();
		task.show(res,dataset,req.fingerprint,host,input,activeTask);		
	});
});




// ----------------------   File Services -----------------------------

app.get('/include', function(req, res) {
	var name = req.query.name;
	var mime = req.query.mime;
	var path = 'views/'+mime+'/'+name+'.'+mime; 
	fs.readFile(path, function (err, data){
		res.setHeader('content-type', 'text/javascript');
		res.end(data);
   	});
});

app.get('/dataset', function(req, res) {
	var name = req.query.name;
	var mime = req.query.mime;
	var start = req.query.start;
	var stop = req.query.stop;
	var path = 'dataset/'+name+'-'+start+'-'+stop+'.'+mime;
	fs.readFile(path, function (err, data){
		res.writeHead(200, {"Content-Type":"video/"+mime});
       		res.end(data);
   	});
});

// ------------- Database Functions ------------------------------



// Exec as sudo to run in port 80
app.listen(80);
