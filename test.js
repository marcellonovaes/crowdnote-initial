
f = require('./fifo.js');
l = require('./lifo.js');


var fifo = new f.FIFO();
var lifo = new l.LIFO();

for(var i=0; i<10; i++){
	fifo.push(i);
}

lifo.setItems(fifo.getItems());
console.log('LIFO: '+lifo.getItems());

fifo.clean();
console.log('FIFO: '+fifo.getItems());


while(!lifo.isEmpty()){
	fifo.push(lifo.pop());
	console.log('#');
	console.log('LIFO: '+lifo.getItems());
	console.log('FIFO: '+fifo.getItems());
}

while(!fifo.isEmpty()){
	lifo.push(fifo.pop());
	console.log('@');
	console.log('LIFO: '+lifo.getItems());
	console.log('FIFO: '+fifo.getItems());
}

