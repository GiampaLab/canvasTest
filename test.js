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


var Vector = (function(){
	function Vector(x, y){
		this.x = x;
		this.y = y;
	};
	return Vector;
}());