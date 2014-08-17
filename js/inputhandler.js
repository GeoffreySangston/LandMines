function InputHandler(gameContainer){
	this.gameContainer = gameContainer;
	
	this.events = {};
	
	this.listen();
}

InputHandler.prototype.listen = function(){
	var self = this;
	
	var clickStartX;
	var clickStartY;
	var clickEndX;
	var clickEndY;
	
	var mouseClickedInGame = false;
	
	this.gameContainer.addEventListener('mousedown', function(e){
			e.preventDefault();
			
			var x = e.x || e.clientX;
			var y = e.y || e.clientY;
			clickStartX = x - self.gameContainer.offsetLeft;
			clickStartY = y - self.gameContainer.offsetTop;
			mouseClickedInGame = true;
			
			var data = {
				mouse : {x: clickStartX, y: clickStartY},
				offsetLeft : self.gameContainer.offsetLeft,
				offsetTop : self.gameContainer.offsetTop,
				mouseNum : e.which
			};
			self.emit("clickStart", data);
			console.log("which: " + e.which);
			
	});
	
	window.addEventListener('mouseup', function(e){
		e.preventDefault();
	
		if(mouseClickedInGame){
			mouseClickedInGame = false;
				
			var x = e.x || e.clientX;
			var y = e.y || e.clientY;
			var clickEndX = x - self.gameContainer.offsetLeft;
			var clickEndY = y - self.gameContainer.offsetTop;
				
			var data = {
					mouse : {x: clickEndX, y: clickEndY}, 
					start : {x: clickStartX, y: clickStartY},
					offsetLeft : self.gameContainer.offsetLeft,
					offsetTop : self.gameContainer.offsetTop,
					mouseNum : e.which
			};
			console.log(data.offsetTop + " : offset");
			self.emit("clickEnd", data);
		}
	});
};

InputHandler.prototype.on = function(event, callback) {
	if(!this.events[event]){ 
		this.events[event] = [];
	}
	this.events[event].push(callback);
};

InputHandler.prototype.emit = function (event, data) {
	var callbacks = this.events[event];
	if (callbacks) {
		callbacks.forEach(function (callback) {
			callback(data);
		});
	}
};