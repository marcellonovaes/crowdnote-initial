
function FIFO(){
	var items = new Array();

	this.push = push;
	this.pop = pop;
	this.isEmpty = isEmpty;
	this.clean = clean;
	this.setItems = setItems;
	this.getItems = getItems;

	function push(item){
		items.push(item);	
	}

	function pop(){
		if(!isEmpty()){
			item = items[0];
			items.shift();
			return item;
		}
		return null;
	}

	function isEmpty(){
		if(items.length > 0){ 
			return false;
		}
		return true;
	}

	function clean(){
		items = [];
	}

	function setItems(v){
		items = v;
	}

	function getItems(){
		return items;
	}
}

module.exports.FIFO = FIFO;

