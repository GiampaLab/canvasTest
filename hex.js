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