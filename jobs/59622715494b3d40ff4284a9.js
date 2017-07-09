
function job(Dataset,Fingerprint,Jobs,Aggregation,Contributions, lifos, fifos, host){

	var fs = require('fs');
	
	this.Dataset = Dataset;
	this.lifos = lifos;
	this.fifos = fifos;
	this.Fingerprint = Fingerprint;
	this.Contributions = Contributions;
	this.host = host;

	this.save = save;
	this.show = show;
	//this.aggregation = aggregation;

	Jobs.findOne({_id:'59622715494b3d40ff4284a9'},function (err, Jobs) {
  		if (err) return console.error(err);

		this.Job = Jobs;

	});

	function save(req, res) {
		var item = req.body.item;
		var fingerprint = req.body.fingerprint;
  		var microtask = req.body.microtask;
  		var contrib = req.body.contrib;
		var instant = req.body.instant;

		var contribution = new Contributions({'item':item , 'microtask':microtask , 'contribution':contrib, 'instant': instant,'date': new Date(), 'fingerprint':fingerprint });

		contribution.save(function (err, m0) {if (err) return console.error(err);});

		show(req, res);
	}

	function show(req, res) {
		var id = 0;
		var tmp = new Array();
		var fingerprint = Fingerprint.get(req);


		Contributions.find({fingerprint: fingerprint, microtask: '59622bfc494b3d40ff4284ab'},function (err, Contributions) {

			if (err) return console.error(err);



		});



	}





}

module.exports.job = job;

