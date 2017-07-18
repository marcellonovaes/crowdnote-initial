
function task(){

	var fs = require('fs');
	
	this.show = show;

	function show(res,Dataset,Fingerprint,Host,Input,activeTask) {

		var item = Input.lifo.pop();
		Input.fifo.push(item);

		var values = {};
		values.fingerprint = Fingerprint;
		values.item_id = item._id;
		values.name = Dataset[item.video].name;
		values.mime = Dataset[item.video].mime;
		values.start = Dataset[item.video].start;
		values.stop = Dataset[item.video].stop;
		values.host = Host;
		values.task = activeTask;

		var path = 'dataset/'+values.name+'-'+values.start+'-'+values.stop+'.'+values.mime;
		var vbin = fs.readFileSync(path);
		var v64 = new Buffer(vbin).toString('base64');
		values.v64 = v64;

		res.render('ejs/task_'+activeTask, values);
		
	}

}

module.exports.task = task;

