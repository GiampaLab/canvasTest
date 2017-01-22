var Hex = (function () {
    function Hex(context, x, y, radius, margin, animator) {
        this.x = x;
        this.y = y;
        this.context = context;
        this.angle = Math.PI / 3;
        this.margin = margin;
        this.radius = radius;
        this.width = this.radius * 2;
        this.height = Math.round(Math.sqrt(3) * this.radius)/2;
        this.cosRadius = Math.round(Math.cos(this.angle) * this.radius);
        // establish grid position
        this.pos = new Vector(x, y);
        // establish pixel position
        this.pixelPos = new Vector(this.radius * 3 * x + y%2 * (this.radius + this.cosRadius), this.height * y);
        this.hexCenter = new Vector(this.radius + 3 * this.radius * x + y%2 * (this.radius + this.cosRadius), this.height + y * this.height);
        this.r = 35;
        this.g = 125;
        this.b = 112;
        this.animator = animator;
        this.state = "ready";
    };
    Hex.prototype.draw = function (self, fillStyle) {
        //if(this.state == "ininted")
        //    return;
        // if(this.state == "mouseOver"){
        //     // this.context.fillStyle = "rgb(" + Math.round(5 * this.brightness) + ","
        //     // + Math.round(6 * Math.pow(this.brightness, 1.6)) + "," + Math.round(16 * this.brightness) + ")";
        //     //this.context.strokeStyle = "rgb(51,15,242)";    
        //     this.context.fillStyle = "rgb(" + this.r +", " + this.g +","+ this.b +")";
        //     while(this.r < 155)
        //         this.r++;
        //     // else{
        //     //     this.brightness += 0.1;
        //     // }
        //     console.log(this.r);
        // }
        // else{
        //     if(this.brightness > this.defaultBrightness)
        //         this.brightness --;
        //     this.context.fillStyle = "rgb(35,135,112)";
        //     this.context.strokeStyle = "rgb(55,175,212)";
        //     if(this.callback){
        //         this.callback();
        //         this.callback = null;
        //     }
        // }
        var that;
        if(self)
            that = self;
        else
            that = this;
        that.context.save();
        if(!fillStyle)
            that.context.fillStyle = "rgb(35,135,112)";
        else
            that.context.fillStyle = fillStyle;
        that.context.translate(that.pixelPos.x, that.pixelPos.y);
        that.context.beginPath();
        that.context.lineTo(that.cosRadius, 0);
        that.context.lineTo(that.radius + that.cosRadius, 0);
        that.context.lineTo(that.radius + 2 * that.cosRadius, that.height);
        that.context.lineTo(that.radius + that.cosRadius, 2 * that.height);
        that.context.lineTo(that.cosRadius, 2 * that.height);
        that.context.lineTo(0, that.height);
		that.context.closePath();
		that.context.fill();
		that.context.stroke();
		that.context.restore();
    };
    Hex.prototype.isPointInPath = function(pos){
        var q2x = Math.abs(pos.x - this.hexCenter.x);
        var q2y = Math.abs(pos.y - this.hexCenter.y);
        var result = false;
        if(q2x <= (this.radius - this.cosRadius) && q2y < this.height)
            result = true;
        else         if (ptInTriangle(new Vector(q2x, q2y), 
            new Vector(this.radius - this.cosRadius, 0),
            new Vector(this.radius, 0),
            new Vector(this.radius - this.cosRadius, this.height))){
            result = true;
        }
        return result;
    }
    function ptInTriangle(p, p0, p1, p2) {
        var A = 1/2 * (-p1.y * p2.x + p0.y * (-p1.x + p2.x) + p0.x * (p1.y - p2.y) + p1.x * p2.y);
        var sign = A < 0 ? -1 : 1;
        var s = (p0.y * p2.x - p0.x * p2.y + (p2.y - p0.y) * p.x + (p0.x - p2.x) * p.y) * sign;
        var t = (p0.x * p1.y - p0.y * p1.x + (p0.y - p1.y) * p.x + (p1.x - p0.x) * p.y) * sign;
        
        return s > 0 && t > 0 && (s + t) < 2 * A * sign;
    }

    Hex.prototype.mouseOver = function(callback){
        if(typeof(this.animId) === "undefined" || this.animId === null){
            this.callback = callback;
            var ctx = this.context;
            var draw = this.draw;
            var self = this;
            this.animId = this.animator.animate(500, 11,
                function(alpha, progress, duration){
                    var fillStyle = "rgb(" + Math.round(self.r * alpha) +", " + Math.round(self.g* alpha) +","+ Math.round(self.b* alpha) +")";
                    self.context.clearRect(self.hexCenter.x - self.radius, self.hexCenter.y - self. hexCenter, self.radius * 2, self.height * 2);
                    self.draw(self, fillStyle);
                    return true;
                }
                , true, true
            );
            console.log("Starts on: ", this.animId,this.x, this.y);
        }
    }
    Hex.prototype.mouseExit = function(callback){
       if(typeof(this.animId) !== "undefined" && this.animId !== null){
            console.log("Ends on: ", this.animId, this.x, this.y);
            this.animator.cancelAnimation(this.animId);
            this.animId = null;
       }
    }
    return Hex;
}());
