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
    Hex.prototype.draw = function (self, fillStyle, progress, alpha) {
        var that;
        if(self)
            that = self;
        else
            that = this;
        //figure out hoe to clear a shape
        //that.context.clearRect(that.hexCenter.x - that.radius, that.hexCenter.y - that.height, that.radius * 2, that.height * 2);
        that.context.save();
        if(!fillStyle){
            that.context.strokeStyle = "rgb(" + that.r +", " + that.g +","+ that.b +")";
        }
        else{
            that.context.strokeStyle = fillStyle;
            
        }
        that.context.translate(that.hexCenter.x, that.hexCenter.y);
        // if(fillStyle)
        //     that.context.rotate(Math.PI * alpha);
        that.context.beginPath();
        that.context.moveTo(-that.radius, 0);
        that.context.lineTo(-that.radius + that.cosRadius, -that.height);
        that.context.lineTo(that.cosRadius,  -that.height);
        that.context.lineTo(2 * that.cosRadius, 0);
        that.context.lineTo(that.cosRadius, that.height);
        that.context.lineTo(-that.radius + that.cosRadius, that.height);
        that.context.lineTo(-that.radius, 0);
        that.context.lineTo(0, 0);
        that.context.lineTo(that.cosRadius,  -that.height);
        that.context.moveTo(0, 0);
        that.context.lineTo(that.cosRadius, that.height);
        that.context.stroke();
        that.context.restore();
    };
    Hex.prototype.isPointInPath = function(pos){
        var q2x = Math.abs(pos.x - this.hexCenter.x);
        var q2y = Math.abs(pos.y - this.hexCenter.y);
        var result = false;
        if(q2x <= (this.radius - this.cosRadius) && q2y < this.height)
            result = true;
        else if (ptInTriangle(new Vector(q2x, q2y), 
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

    Hex.prototype.mouseOver = function(callback, mousePos){
        this.mousePos = mousePos;
        if(typeof(this.animId) === "undefined" || this.animId === null){
            this.callback = callback;
            var ctx = this.context;
            var draw = this.draw;
            var self = this;
            this.animId = this.animator.animate(1000, 10,
                function(alpha, progress, duration){
                    var value = alpha + 0.4 * (1- alpha);
                    var fillStyle = "rgb(" + Math.round(self.r * value) +", " + Math.round(self.g* value) +","+ Math.round(self.b* value) +")";
                    self.draw(self, fillStyle, progress, alpha);
                    if(self.stopAnimation){
                        if(self.r * value === self.r){
                            self.animator.cancelAnimation(self.animId);
                            self.animId = null;
                            self.stopAnimation = false;
                        }
                    }
                    return true;
                }
                , true, false
            );
        }
    }
    Hex.prototype.mouseExit = function(callback){
       if(typeof(this.animId) !== "undefined" && this.animId !== null){
            this.stopAnimation = true;
       }
    }
    return Hex;
}());
