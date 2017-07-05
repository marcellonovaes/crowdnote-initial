
function Database(){

this.Jobs;
this.Microtasks;
this.Dataset;
 this.Contributions;

	var mongoose = require('mongoose');
	mongoose.connect('mongodb://localhost/db');
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('openUri', function() {});

	var jobsSchema;
	var microtasksSchema;
	var datasetsSchema;
	var contributionsSchema;
	var Schema = mongoose.Schema; 
	var ObjectId = Schema.ObjectId;
	var Timestamp = Schema.Timestamp;

	compileSchemas();


	function compileSchemas(){
		jobsSchema = Schema({
   		 	_id: ObjectId,
    			order: Number,
    			objective: String,
    			instruction: String,
		});
		this.Jobs = mongoose.model('Jobs', jobsSchema);

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
		    	_id: ObjectId,
    			microtask: ObjectId,
    			item: ObjectId,
    			constribution: String,
			date : Date,
			fingerprint: String 
		});
		Contributions = mongoose.model('Contributions', contributionsSchema);
	}








}	


module.exports.Database = Database;



