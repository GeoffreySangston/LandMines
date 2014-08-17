function ApplicationManager(HTMLActuator,Renderer,InputHandler){
	this.htmlActuator = new HTMLActuator();
	this.renderer = new Renderer(this.htmlActuator.canvas,GAMEWIDTH,GAMEHEIGHT);
	this.inputHandler = new InputHandler(this.htmlActuator.canvas);
	
	this.inputHandler.on("clickStart", this.clickStart.bind(this));
	this.inputHandler.on("clickEnd", this.clickEnd.bind(this));

	this.board = new GameBoard(GAMEWIDTH,GAMEHEIGHT,10,10);
	this.shouldRender = true;
	
	this.numTurns = 0;
	this.gameOver = false;
	this.gameLoop();
}

ApplicationManager.prototype.gameLoop = function(){
	
	this.gameLogic();
	if(this.shouldRender){
		this.render(); // only really have to render after actions
		this.shouldRender = false;
	}
	
	window.requestAnimationFrame(this.gameLoop.bind(this));
};

ApplicationManager.prototype.clickStart = function(data){
	if(data.mouseNum == 1){
		this.leftClickStart(data);
	} else {
		this.rightClickStart(data);
	}
};

ApplicationManager.prototype.clickEnd = function(data){
	if(data.mouseNum == 1){
		this.leftClickEnd(data);
	} else {
		this.rightClickEnd(data);
	}
	
};

ApplicationManager.prototype.leftClickStart = function(data){
	var clickStartTile = this.board.calcSquareAtXY(data.mouse.x, data.mouse.y);

	clickStartTile.pushedDown = true;
	this.shouldRender = true;
};

ApplicationManager.prototype.rightClickStart = function(data){

};

ApplicationManager.prototype.leftClickEnd = function(data){
	var clickStartTile = this.board.calcSquareAtXY(data.start.x, data.start.y);
	var clickEndTile = this.board.calcSquareAtXY(data.mouse.x, data.mouse.y);
	
	clickStartTile.pushedDown = false;
	this.shouldRender = true;
	var clickIndex = this.board.calcIndexAtXY(data.start.x,data.start.y);

	if(clickStartTile == clickEndTile && !this.board.squares[clickIndex].revealed){
		if(this.numTurns == 0){
			this.board.fillBoard(clickIndex);
			
		} 
		if(clickStartTile.value == -1){
			this.gameOver == true;
			this.board.revealMines();
		} else {
			this.board.revealAdjZeroSquaresFromXY(data.start.x,data.start.y);
		}
		this.numTurns++;
		
	}
};

ApplicationManager.prototype.rightClickEnd = function(data){
	var clickStartTile = this.board.calcSquareAtXY(data.start.x, data.start.y);
	var clickEndTile = this.board.calcSquareAtXY(data.mouse.x, data.mouse.y);
	
	this.shouldRender = true;
	if(clickStartTile == clickEndTile){
		if(!clickStartTile.revealed){
			if(clickStartTile.hasFlag){
				clickStartTile.hasFlag = false;
			} else {
				clickStartTile.hasFlag = true;
			}
		}
	}
};

ApplicationManager.prototype.gameLogic = function(){

};

ApplicationManager.prototype.render = function(){
	this.renderer.cls();

	for(var i = 0; i < this.board.squares.length; i++){
		var x = this.board.squares[i].x;
		var y = this.board.squares[i].y;
		var w = this.board.squares[i].width;
		var h = this.board.squares[i].height;
		var squareColor; // normally all logic should be separate from rendering but here it's whatever
		var textColor = "#FFFFFF";
		var text = "";
		if(this.board.squares[i].revealed){
			if(this.board.squares[i].value == -1){
				squareColor = "#FF0000";
			} else {
				squareColor = "#FFFFFF";
				if(this.board.squares[i].value > 0){
					text = "" + this.board.squares[i].value;
					switch(this.board.squares[i].value){
					case 1: textColor = "#0000FF"; break;
					case 2: textColor = "#00FF00"; break;
					default: textColor= "#FF0000";
					}
				}
			}
		} else {
			if(this.board.squares[i].pushedDown){
				squareColor = "#555555";
			} else if(this.board.squares[i].hasFlag){
				squareColor = "#FF6600";
			} else {
				squareColor = "#888888";
			}
		}
		this.renderer.drawRect(x,y,w,h,squareColor);
		this.renderer.strokeRect(x,y,w,h,"#000000");
		this.renderer.drawText(x+9,y+23,text,20,textColor);
	}


	
};
