function GameBoard(width,height,numRows,numCols){
	this.width = width;
	this.height = height;
	this.numRows = numRows;
	this.numCols = numCols;
	this.mineProb = .25;
	
	this.squareWidth = this.width/this.numCols;
	this.squareHeight = this.height/this.numRows;
	
	this.squares = this.genBlankBoard();
	this.squaresWithMines = [];
	this.numSquaresLeft; // The number of non-mine squares left that haven't been revealed, you win when this equals 0
	
}

GameBoard.prototype.genBlankBoard = function(){
	var numSquares = this.numRows*this.numCols;
	var squares = [];

	for(var i = 0; i < numSquares; i++){
		
		var x = (i%this.numCols)*this.squareWidth;
		var y = Math.floor(i/this.numCols)*this.squareHeight;

		var mineSquare = new MineSquare(x,y,this.squareWidth,this.squareHeight,0);
		
		squares.push(mineSquare);
	}


	return squares;
};
GameBoard.prototype.fillBoard = function(clickIndex){ // clickIndex is an index that cannot be a bomb
	
	this.__fillMines(clickIndex);
	
	// now do adjacent mines for values
	this.__fillValues();

	
};

GameBoard.prototype.__fillMines = function(clickIndex){
	this.numSquaresLeft = 0;

	for(var i = 0; i < this.squares.length; i++){
		var mineCoinFlip = Math.random();
		var squareValue;
		if(mineCoinFlip <= this.mineProb){
			squareValue = -1; // is mine
			this.squaresWithMines.push(this.squares[i]);
		} else { // is not mine
			squareValue = 0;
			this.numSquaresLeft++;
		}

		this.squares[i].value = squareValue;
		
	}
	
	var clickIndexAdjSquares = this.__calcAdjSquares(clickIndex);
	
	this.squares[clickIndex].value = 0;
	for(var i = 0; i < clickIndexAdjSquares.length; i++){
		clickIndexAdjSquares[i].value = 0;
	}
};

GameBoard.prototype.__fillValues = function(){
	for(var i = 0; i < this.squares.length; i++){
		if(this.squares[i].value != -1){ // if it's not a mine
			var adjacentSquares = this.__calcAdjSquares(i);
			var numAdjacentMines = 0;
			
			for(var j = 0; j < adjacentSquares.length; j++){
				if(adjacentSquares[j].value == -1){
					numAdjacentMines++;
				}
			}
			
			this.squares[i].value = numAdjacentMines;
		} 
	}
}

GameBoard.prototype.__calcAdjSquares = function(index){
	/**
	returns array of adjacent squares to the square in the squares array at index
	*/
	
	var adjacentSquares = [];
	
	var xOffsets = [-1,0,1,-1,1,-1,0,1];
	var yOffsets = [-1,-1,-1,0,0,1,1,1];
	var indexOffsets = [-this.numCols - 1, -this.numCols, -this.numCols+1, -1, 1, this.numCols-1,this.numCols,this.numCols+1];

	for(var i = 0; i < xOffsets.length; i++){
		var adjSquareIndex = index + indexOffsets[i];
		if(adjSquareIndex >= 0 && adjSquareIndex <= this.squares.length  -1){

			var cellX = this.squares[index].x + xOffsets[i]*this.squares[adjSquareIndex].width;
			var cellY = this.squares[index].y + yOffsets[i]*this.squares[adjSquareIndex].height;
			
			
			if(this.__validCellXY(cellX,cellY)){
				adjacentSquares.push(this.squares[adjSquareIndex]);
			}
		}
	}
	
	return adjacentSquares;
};


GameBoard.prototype.__validCellXY = function(x,y){
	return (x >= 0 && x < this.width) && (y >= 0 && y < this.height);
};

GameBoard.prototype.calcSquareAtXY = function(x,y){
	if(!this.__validCellXY(x,y)){
		return;
	}
	var index = this.calcIndexAtXY(x,y);
	return this.squares[index];
};

GameBoard.prototype.calcIndexAtXY = function(x,y){ // probably a code bloat but who cares, could change later
	if(!this.__validCellXY(x,y)){
		return;
	}
	
	var cellCol = Math.floor(x/this.squareWidth);
	var cellRow = Math.floor(y/this.squareHeight);
	var index = cellRow * this.numCols + cellCol;
	
	return index;
};

GameBoard.prototype.revealAdjZeroSquaresFromXY = function(x,y){
	var clickedSquare = this.calcSquareAtXY(x,y);
	var clickedIndex = this.calcIndexAtXY(x,y);
	
	var zeroSquares = [clickedSquare];
	var zeroIndices = [clickedIndex];
	var revealedIndices = [];

	while(zeroSquares.length > 0){
		var curLength = zeroSquares.length-1;
		var adjSquares = [];
		for(var i = curLength; i >= 0; i--){
			adjSquares = adjSquares.concat(this.__calcAdjSquares(zeroIndices[i]));
			zeroSquares[i].revealed = true;
			revealedIndices.push(zeroIndices[i]);
		}
		
		zeroSquares.length = 0;
		zeroIndices.length = 0;
		
		for(var i = 0; i < adjSquares.length; i++){
			if(adjSquares[i].value == 0 && adjSquares[i].revealed == false){
				zeroSquares.push(adjSquares[i]);
				var index = this.calcIndexAtXY(adjSquares[i].x, adjSquares[i].y);
				zeroIndices.push(index);
			}
		}
	}
	
	var revealedIndicesAdjSquares = [];
	for(var i = 0; i < revealedIndices.length; i++){
		revealedIndicesAdjSquares = revealedIndicesAdjSquares.concat(this.__calcAdjSquares(revealedIndices[i]));
	}
	
	// Now reveal border squares of zero squares
	for(var i = 0; i < revealedIndicesAdjSquares.length; i++){
		if(revealedIndicesAdjSquares[i].value > 0){
			revealedIndicesAdjSquares[i].revealed = true;
		}
	}
};

GameBoard.prototype.revealMines = function(){
	for(var i = 0; i < this.squaresWithMines.length; i++){
		this.squaresWithMines[i].revealed = true;
	}
};