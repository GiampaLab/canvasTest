var canvas;
var ctx;
var img;
var x = y = 0;
var hex;
var images = [];
var moveUp = true;
var playerCurrentCard;
var extractedCard;
var state;

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
		'content/icons/pikachu-2.svg', 'content/icons/snorlax.svg', 'content/icons/rattata.svg',
        'content/icons/candy.svg', 'content/icons/caterpie.svg', 'content/icons/dratini.svg',
        'content/icons/insignia.svg', 'content/icons/instinct.svg', 'content/icons/meowth.svg',
        'content/icons/lucky-egg.svg', 'content/icons/mankey.svg'], start);
}

function start(){
	canvas = document.getElementById('myContainer');
    var boardCanvas = document.getElementById('boardContainer');
	ctx = canvas.getContext('2d');
    boardCtx = boardCanvas.getContext('2d');
    board = new Board(canvas.clientWidth, canvas.clientHeight, 4);
	board.draw(boardCtx);
    playerCurrentCard = new Card(board,images.slice(8,16));
    extractedCard = new Card(board,images.slice(0,8));
    playerCurrentCard.setPos(board.rows-2);
    extractedCard.setPos(0);
    playerCurrentCard.draw();
    extractedCard.draw();
    
    canvas.addEventListener("click", function(){
    	if(moveUp)
            moveUp = playerCurrentCard.moveUp(onFininsh);    
        else
            moveUp = !playerCurrentCard.moveDown(onFininsh);
        state = "move";
        window.requestAnimationFrame(draw); 
    }, false);
}

function onFininsh(){
    state = "init";
}

function draw(){
    if(state != "move")
        return;
	//ctx.globalCompositeOperation = 'destination-over';
    ctx.clearRect(0,0,canvas.clientWidth,canvas.clientHeight); // clear canvas
    //board.draw();
    playerCurrentCard.draw();
    extractedCard.draw();
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
        //even number of rows
        if(this.rows % 2 == 1)
            this.rows -= 1;
        for (var x = 0; x < this.columns; x++) {
            this.hexagons.push([]);
            for (var y = 0; y < this.rows; y++) {
                var hex = new Hex(x, y, this.hexRadius, this.hexMargin);
                this.hexagons[x].push(hex);
            }
        }       
    };
    Board.prototype.draw = function(ctx){
        for (var x = 0; x < this.columns; x++) {
            for (var y = 0; y < this.rows; y++) {
                var hex = this.hexagons[x][y];
                hex.draw(ctx);
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