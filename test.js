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
    board = new Board(boardCtx, canvas.clientWidth, canvas.clientHeight, 4);
	board.draw();
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
    canvas.addEventListener("mousemove", function(evt) { 
        state = "mousemove";
        var mousePos = getMousePos(canvas, evt);
        board.mouseOver(mousePos, onFininsh);
        window.requestAnimationFrame(draw); 
    });
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return new Vector(evt.clientX - rect.left, evt.clientY - rect.top);
}

function onFininsh(){
    state = null;
}

function draw(){
    if(!state)
        return;
    if(state == "move"){
    	//ctx.globalCompositeOperation = 'destination-over';
        ctx.clearRect(0,0,canvas.clientWidth,canvas.clientHeight); // clear canvas
        //board.draw();
        playerCurrentCard.draw();
        extractedCard.draw();
    	window.requestAnimationFrame(draw);	
    }
    if(state == "mousemove"){
        board.draw();
        window.requestAnimationFrame(draw); 
    }
};