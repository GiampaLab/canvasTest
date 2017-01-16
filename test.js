var canvas;
var ctx;
var img;
var x = y = 0;
var hex;
var images = [];
var moveUp = true;

function loadImages(arr, callback) {
    var loadedImageCount = 0;

    // Make sure arr is actually an array and any other error checking
    for (var i = 0; i < arr.length; i++){
        var img = new Image();
        img.onload = imageLoaded;
        img.src = arr[i];
        images.push(img);
    }

    function imageLoaded(e) {
        loadedImageCount++;
        if (loadedImageCount >= arr.length) {
            callback();
        }
    }
}

function init(){
	loadImages(['content/icons/bullbasaur.svg', 'content/icons/charmander.svg', 
		'content/icons/eevee.svg', 'content/icons/jigglypuff.svg', 'content/icons/pidgey.svg', 
		'content/icons/pikachu-2.svg', 'content/icons/snorlax.svg', 'content/icons/rattata.svg'], start);
}

function start(){
	canvas = document.getElementById('myContainer');
	ctx = canvas.getContext('2d');
    board = new Board(canvas.clientWidth, canvas.clientHeight, 4);
	board.draw();
    playerCurrentCard = new Card(board,images);
    playerCurrentCard.setPos(board.rows-2);
    window.requestAnimationFrame(draw);	
    canvas.addEventListener("click", function(){
    	if(moveUp)
        moveUp = playerCurrentCard.moveUp();    
    else
        moveUp = !playerCurrentCard.moveDown();
    }, false);
}

function draw(){
	//ctx.globalCompositeOperation = 'destination-over';
    ctx.clearRect(0,0,canvas.clientWidth,canvas.clientHeight); // clear canvas
    board.draw();
    playerCurrentCard.draw();
	window.requestAnimationFrame(draw);	
};

var Board = (function(){
    function Board(width, height, columns){
        this.width = width;
        this.height = height;
        this.columns = columns;
        this.hexRadius; // from center to one of the points
        this.hexMargin = 2; // space around hexagons
        this.hexagons = [];
        this.hexAngle = Math.PI / 3;
        this.hexRadius = this.width/(3 * this.columns + Math.cos(this.hexAngle));
        this.rows = Math.floor(((height - this.hexRadius * Math.sin(this.hexAngle))/ (this.hexRadius * Math.sin(this.hexAngle))));
        for (var x = 0; x < this.columns; x++) {
            this.hexagons.push([]);
            for (var y = 0; y < this.rows; y++) {
                var hex = new Hex(x, y, this.hexRadius, this.hexMargin);
                this.hexagons[x].push(hex);
            }
        }       
    };
    Board.prototype.draw = function(){
        for (var x = 0; x < this.columns; x++) {
            for (var y = 0; y < this.rows; y++) {
                var hex = this.hexagons[x][y];
                hex.draw();
            }
        }
    }
    return Board;
}());

var Hex = (function () {
    function Hex(x, y, radius, margin) {
        this.angle = Math.PI / 3;
        this.margin = margin;
        this.radius = radius;
        this.width = this.radius * 2;
        this.height = Math.sqrt(3) * this.radius;
        // establish grid position
        this.pos = new Vector(x, y);
        // establish pixel position
        this.pixelPos = new Vector(this.radius * 3 * x + y%2 * (this.radius + this.radius * Math.cos(this.angle)), this.height * y * 0.5);
    };
    Hex.prototype.draw = function () {
        var brightness = 17;
        var computedHexRadius = this.radius;
        ctx.save();
        ctx.translate(this.pixelPos.x, this.pixelPos.y);
        ctx.fillStyle = "rgb(35,135,112)";
        ctx.strokeStyle = "rgb(55,175,212)";
        ctx.beginPath();
        ctx.lineTo(this.radius * Math.cos(this.angle), 0);
        ctx.lineTo(this.radius + this.radius * Math.cos(this.angle), 0);
        ctx.lineTo(this.radius + 2 * this.radius * Math.cos(this.angle), Math.sin(this.angle) * this.radius);
        ctx.lineTo(this.radius + this.radius * Math.cos(this.angle), 2 * Math.sin(this.angle) * this.radius);
        ctx.lineTo(this.radius * Math.cos(this.angle), 2 * Math.sin(this.angle) * this.radius);
        ctx.lineTo(0, Math.sin(this.angle) * this.radius);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
		ctx.restore();
    };
    return Hex;
}());

var Vector = (function(){
	function Vector(x, y){
		this.x = x;
		this.y = y;
	};
	return Vector;
}());

var Card = (function(){
    function Card(board, symbols){
        this.board = board;
        this.symbols = symbols;
        this.images = [];        
    };
    Card.prototype.draw = function(){
        var i = 0;
        for(var y= this.currentPos; y < this.currentPos + 2; y++){
            for(var x = 0; x < this.board.columns; x++){
                var theHex = this.board.hexagons[x][y];
                var posy = theHex.pixelPos.y;
                if(this.direction && this.symbols[i].previousPos){
                	if(this.direction == "up" && this.symbols[i].previousPos - 4 > theHex.pixelPos.y ){
                		this.symbols[i].previousPos = this.symbols[i].previousPos - 4;
                		posy = this.symbols[i].previousPos;
                	}
                	else if(this.symbols[i].previousPos + 4 < theHex.pixelPos.y ){
                		this.symbols[i].previousPos = this.symbols[i].previousPos + 4;
                		posy = this.symbols[i].previousPos;
                	}
                	else{
                		posy = theHex.pixelPos.y;
                	}
                }
        		innerDraw(this.symbols[i], theHex.pixelPos.x, posy, theHex.radius);
        		if(posy == theHex.pixelPos.y)
        			this.symbols[i].previousPos = theHex.pixelPos.y;
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
        var i = 0;
        this.direction = "up";
        this.currentPos -= 2;
        if(this.currentPos - 2 < 0)
            return false;
        return true;
    };
    Card.prototype.moveDown = function(){
    	this.currentPos += 2;
        this.direction = "down";
        if(this.currentPos >= board.hexagons[0].length -2)
            return false;
        return true;
    };
    return Card;
}());