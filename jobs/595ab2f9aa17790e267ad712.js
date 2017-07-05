

function job_595ab2f9aa17790e267ad712(){




}

module.exports.job_595ab2f9aa17790e267ad712 = job_595ab2f9aa17790e267ad712;


function init_595ab2f9aa17790e267ad712(req, res) {
//	console.log('ok');

//Microtasks 0 and 1
//5956e7825d39ebf26fb71ee0
//595ab37eaa17790e267ad714

/*	var id = 0;
	var fingerprint = ip;
	fingerprint += req.headers['user-agent'];
	fingerprint = crypto.createHash('md5').update(fingerprint).digest("hex");
*/

	Contributions.find({fingerprint: fingerprint},function (err, Contributions) {
		if (err) return console.error(err);

		//Buscar na base de contributions pelo Fingerprint, somente IDs das imagens
	

		var item = lifos[id].pop();

		//Se o item aparecer na lista acima, ele volta pra pilha (repete enquanto)


		//Se o worker ainda nao contribuiu naquele item, segue em frente e ele vai pra fila
		fifos[id].push(item);

		if(lifos[id].isEmpty()){
			lifos[id].setItems(fifos[id].getItems().reverse());
			fifos[id].clean();	
		}

		var values = {};
		values.fingerprint = fingerprint;
		var dir = item.job;
		var name = item.name;
		var mime = item.mime;
		var path = 'data/'+dir+'/'+name+'.'+mime;
		var vbin = fs.readFileSync(path);
		var v64 = new Buffer(vbin).toString('base64');
		values.v64 = v64;
		values.host = host;
		values.item = item;
		values.job = item.job;
		values.name = item.name;
		values.mime = item.mime;
		values.start = item.start;
		values.stop = item.stop;


		res.render('595ab2f9aa17790e267ad712', values);

	});



