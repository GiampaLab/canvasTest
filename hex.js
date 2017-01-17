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
    Hex.prototype.draw = function (context) {
        var brightness = 17;
        var computedHexRadius = this.radius;
        context.save();
        context.translate(this.pixelPos.x, this.pixelPos.y);
        context.fillStyle = "rgb(35,135,112)";
        context.strokeStyle = "rgb(55,175,212)";
        context.beginPath();
        context.lineTo(this.radius * Math.cos(this.angle), 0);
        context.lineTo(this.radius + this.radius * Math.cos(this.angle), 0);
        context.lineTo(this.radius + 2 * this.radius * Math.cos(this.angle), Math.sin(this.angle) * this.radius);
        context.lineTo(this.radius + this.radius * Math.cos(this.angle), 2 * Math.sin(this.angle) * this.radius);
        context.lineTo(this.radius * Math.cos(this.angle), 2 * Math.sin(this.angle) * this.radius);
        context.lineTo(0, Math.sin(this.angle) * this.radius);
		context.closePath();
		context.fill();
		context.stroke();
		context.restore();
    };
    return Hex;
}());