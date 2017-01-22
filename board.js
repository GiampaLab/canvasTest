var Board = (function(){
    function Board(context, width, height, columns, animator){
        this.animator = animator;
        this.context = context;
        this.width = width;
        this.height = height;
        this.columns = columns;
        this.hexRadius; // from center to one of the points
        this.hexMargin = 2; // space around hexagons
        this.hexagons = [];
        this.hexAngle = Math.PI / 3;
        this.hexRadius = Math.round(this.width/(3 * this.columns + Math.cos(this.hexAngle)));
        this.rows = Math.floor(((height - this.hexRadius * Math.sin(this.hexAngle))/ (this.hexRadius * Math.sin(this.hexAngle))));
        //even number of rows
        if(this.rows % 2 == 1)
            this.rows -= 1;
        for (var x = 0; x < this.columns; x++) {
            this.hexagons.push([]);
            for (var y = 0; y < this.rows; y++) {
                var hex = new Hex(context, x, y, this.hexRadius, this.hexMargin, animator);
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
    Board.prototype.mouseOver = function(mousePos, callback){
        var hex;
        for (var x = 0; x < this.columns; x++) {
            for (var y = 0; y < this.rows; y++) {
                if(this.hexagons[x][y].isPointInPath(mousePos)){
                    var hex = this.hexagons[x][y];
                    hex.mouseOver(callback);
                }
                else{
                    this.hexagons[x][y].mouseExit(callback);
                }
            }
        }           
    }
    Board.prototype.getHexAtPoint = function(pos){
        for (var x = 0; x < this.columns; x++) {
            for (var y = 0; y < this.rows; y++) {
                var hex = this.hexagons[x][y];
                if(hex.isPointInPath(pos))
                    return hex;
            }
        }           
        return null;
    }
    return Board;
}());