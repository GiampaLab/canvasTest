var Card = (function(){
    function Card(board, symbols){
        this.board = board;
        this.symbols = symbols;
        this.images = [];    
        this.animation;    
        this.animationActive = false;
    };
    Card.prototype.draw = function(){
        var i = 0;
        for(var y= this.currentPos; y < this.currentPos + 2; y++){
            for(var x = 0; x < this.board.columns; x++){
                var theHex = this.board.hexagons[x][y];
                var posy = theHex.pixelPos.y;
                if(this.animation){
                	if(this.animation == "up" && this.symbols[i].previousPos - 4 > theHex.pixelPos.y ){
                		this.symbols[i].previousPos = this.symbols[i].previousPos - 4;
                		posy = this.symbols[i].previousPos;
                	}
                	else if(this.symbols[i].previousPos + 4 < theHex.pixelPos.y ){
                		this.symbols[i].previousPos = this.symbols[i].previousPos + 4;
                		posy = this.symbols[i].previousPos;
                	}
                	else{
                		posy = theHex.pixelPos.y;
                        this.animation = null;
                	}
                }
                if(!this.animation)
                    this.symbols[i].previousPos = theHex.pixelPos.y;
        		innerDraw(this.symbols[i], theHex.pixelPos.x, posy, theHex.radius);
            	i++;
            }
        }
    };
    function innerDraw(symbol, x, y, radius, angle){
    	ctx.drawImage(symbol, x + radius/2, y + radius*Math.sin(Math.PI/3)/2, radius, radius);
    }
    Card.prototype.setPos = function(pos){
    	this.currentPos = pos;
    };
    Card.prototype.moveUp = function(){
        if(this.animation)
            return true;
        var i = 0;
        this.animation = "up";
        this.currentPos -= 2;
        if(this.currentPos - 2 < 0)
            return false;
        return true;
    };
    Card.prototype.moveDown = function(){
        if(this.animation)
            return true;
    	this.currentPos += 2;
        this.animation = "down";
        if(this.currentPos >= board.hexagons[0].length -2)
            return false;
        return true;
    };
    return Card;
}());