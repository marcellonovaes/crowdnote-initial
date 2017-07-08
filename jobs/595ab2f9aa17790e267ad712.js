
function job_595ab2f9aa17790e267ad712(Fingerprint,Jobs,Contributions, lifos, fifos, host){

	var fs = require('fs');
	
	this.lifos = lifos;
	this.fifos = fifos;
	this.Fingerprint = Fingerprint;
	this.Contributions = Contributions;
	this.host = host;

	this.save = save;
	this.show = show;

	Jobs.findOne({_id:'595ab2f9aa17790e267ad712'},function (err, Jobs) {
  		if (err) return console.error(err);

		this.Job = Jobs;

	}).sort({order: 1});

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

				values.microtask = '5956e7825d39ebf26fb71ee0';

				values.instruction = Job.instruction;

				res.render('jobs/'+item.job, values);

			});

	}

}

module.exports.job_595ab2f9aa17790e267ad712 = job_595ab2f9aa17790e267ad712;

