function MineSquare(x,y,w,h,val){
	this.x = x;
	this.y = y;
	this.width = w;
	this.height = h;
	this.value = val; // -1 for mine
	
	this.revealed = false;
	this.pushedDown = false;
	this.hasFlag = false;
};