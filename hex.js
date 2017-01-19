var Hex = (function () {
    function Hex(context, x, y, radius, margin) {
        this.context = context;
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
        this.context.save();
        if(this.state == "mouseOver"){
            this.context.fillStyle = "rgb(65,115,12)";
            this.context.strokeStyle = "rgb(51,15,242)";    
        }
        else{
            this.context.fillStyle = "rgb(35,135,112)";
            this.context.strokeStyle = "rgb(55,175,212)";
        }
        this.context.translate(this.pixelPos.x, this.pixelPos.y);
        this.context.beginPath();
        this.context.lineTo(this.radius * Math.cos(this.angle), 0);
        this.context.lineTo(this.radius + this.radius * Math.cos(this.angle), 0);
        this.context.lineTo(this.radius + 2 * this.radius * Math.cos(this.angle), Math.sin(this.angle) * this.radius);
        this.context.lineTo(this.radius + this.radius * Math.cos(this.angle), 2 * Math.sin(this.angle) * this.radius);
        this.context.lineTo(this.radius * Math.cos(this.angle), 2 * Math.sin(this.angle) * this.radius);
        this.context.lineTo(0, Math.sin(this.angle) * this.radius);
		this.context.closePath();
		this.context.fill();
		this.context.stroke();
		this.context.restore();
        if(this.callback)
            this.callback();
    };
    Hex.prototype.isPointInPath = function(pos){
        this.context.save();
        this.context.fillStyle = "rgb(35,135,112)";
        this.context.strokeStyle = "rgb(55,175,212)";
        this.context.beginPath();
        this.context.lineTo(this.pixelPos.x + this.radius * Math.cos(this.angle), this.pixelPos.y);
        this.context.lineTo(this.pixelPos.x + this.radius + this.radius * Math.cos(this.angle), this.pixelPos.y);
        this.context.lineTo(this.pixelPos.x + this.radius + 2 * this.radius * Math.cos(this.angle), Math.sin(this.angle) * this.radius + this.pixelPos.y);
        this.context.lineTo(this.pixelPos.x + this.radius + this.radius * Math.cos(this.angle), 2 * Math.sin(this.angle) * this.radius + this.pixelPos.y);
        this.context.lineTo(this.pixelPos.x + this.radius * Math.cos(this.angle), 2 * Math.sin(this.angle) * this.radius + this.pixelPos.y);
        this.context.lineTo(this.pixelPos.x, Math.sin(this.angle) * this.radius + this.pixelPos.y);
        this.context.closePath();
        this.context.stroke();
        this.context.restore();
        return this.context.isPointInPath(pos.x, pos.y);
    }
    Hex.prototype.mouseOver = function(callback){
        this.callback = callback;
        this.state = "mouseOver";
    }
    Hex.prototype.mouseExit = function(callback){
        this.callback = callback;
        this.state = "mouseExit";
    }
    return Hex;
}());