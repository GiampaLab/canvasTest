var canvas;
var boardCanvas;
var ctx;
var img;
var x = y = 0;
var hex;
var images = [];
var moveUp = true;
var playerCurrentCard;
var extractedCard;
var state;
var animator;

function loadImages(arr, callback) {
    var loadedImageCount = 0;

    // Make sure arr is actually an array and any other error checking
    for (var i = 0; i < arr.length; i++) {
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

function init() {
    loadImages(['content/icons/bullbasaur.svg', 'content/icons/charmander.svg',
        'content/icons/eevee.svg', 'content/icons/jigglypuff.svg', 'content/icons/pidgey.svg',
        'content/icons/pikachu-2.svg', 'content/icons/snorlax.svg', 'content/icons/rattata.svg',
        'content/icons/candy.svg', 'content/icons/caterpie.svg', 'content/icons/dratini.svg',
        'content/icons/insignia.svg', 'content/icons/instinct.svg', 'content/icons/meowth.svg',
        'content/icons/lucky-egg.svg', 'content/icons/mankey.svg'
    ], start);
}

function start() {
    animator = new Animator();
    canvas = document.getElementById('myContainer');
    boardCanvas = document.getElementById('boardContainer');
    setCanvasWidthAndHeight(canvas);
    setCanvasWidthAndHeight(boardCanvas);
    ctx = canvas.getContext('2d');
    boardCtx = boardCanvas.getContext('2d');
    board = new Board(boardCtx, canvas.clientWidth, canvas.clientHeight, 4, animator);
    board.draw();
    playerCurrentCard = new Card(board, images.slice(8, 16));
    extractedCard = new Card(board, images.slice(0, 8));
    playerCurrentCard.setPos(board.rows - 2);
    extractedCard.setPos(0);

    //playerCurrentCard.draw();
    //extractedCard.draw();

    canvas.addEventListener("click", function() {
        if (moveUp)
            moveUp = playerCurrentCard.moveUp(onFininsh);
        else
            moveUp = !playerCurrentCard.moveDown(onFininsh);
        state = "move";
        //window.requestAnimationFrame(draw); 
    }, false);
    boardCanvas.addEventListener("mousemove", function(evt) {
        state = "mousemove";
        var mousePos = getMousePos(boardCanvas, evt);
        board.mouseMove(mousePos);
    });
    boardCanvas.addEventListener("mouseout", function(evt) {
        board.mouseOut(evt);
    });
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return new Vector(evt.clientX - rect.left, evt.clientY - rect.top);
}

function onFininsh() {
    state = null;
}

// function draw(){
//     if(!state)
//         return;
//     if(state == "move"){
//     	//ctx.globalCompositeOperation = 'destination-over';
//         ctx.clearRect(0,0,canvas.clientWidth,canvas.clientHeight); // clear canvas
//         //board.draw();
//         playerCurrentCard.draw();
//         extractedCard.draw();
//     	//window.requestAnimationFrame(draw);	
//     }
//     if(state == "mousemove"){
//         board.draw();
//         //window.requestAnimationFrame(draw); 
//     }
// };

function setCanvasWidthAndHeight(canvas) {
    var style = window.getComputedStyle(canvas);
    var widthPx = style.getPropertyValue("width");
    var width = widthPx.substring(0, widthPx.indexOf("px"));
    var heightPx = style.getPropertyValue("height");
    var height = heightPx.substring(0, heightPx.indexOf("px"));
    canvas.width = parseInt(width);
    canvas.height = parseInt(height);
}

var Vector = (function() {
    function Vector(x, y) {
        this.x = x;
        this.y = y;
    };
    return Vector;
}());