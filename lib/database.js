
function DAO(){


	this.loadDataset = loadDataset;
	this.loadInput = loadInput;


	var util = require('./util.js');

	var mongoose = require('mongoose');
	mongoose.Promise = global.Promise;
	mongoose.connect('mongodb://localhost/db');
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('openUri', function() {});

	var videosSchema, Videos;
	var Schema = mongoose.Schema; 
	var ObjectId = Schema.ObjectId;
	var Timestamp = Schema.Timestamp;

	compileSchemas();


	function compileSchemas(){

		videoSchema = Schema({
   		 	_id: ObjectId,
    			mime: String,
    			name: String,
    			start: Number,
			stop: Number
		});
		Video = mongoose.model('Video', videoSchema);

		inputSchema = Schema({
   		 	_id: ObjectId,
    			video: String,
			task: Number
		});
		Input = mongoose.model('Input', inputSchema);


	}

	function loadDataset(callback){
		Video.find({},function (err, V) {
  			if (err) return console.error(err);
			var dataset = new Array();
			for(var i=0; i < V.length; i++){
				dataset[V[i]._id] = V[i];
			}
			callback(dataset);
		}).sort({'_id' : 1});
	}


	function loadInput(task, callback){
		Input.find({task:task},function (err, I) {
  			if (err) return console.error(err);
			var input = {'lifo': new util.LIFO(), 'fifo': new util.FIFO()};
			input.lifo.setItems(I);
			callback(input);
		}).sort({'_id' : -1});
	}


}	

module.exports.DAO = DAO;



