var Hex = (function () {
    function Hex(context, x, y, radius, margin, animator) {
        this.x = x;
        this.y = y;
        this.context = context;
        this.angle = Math.PI / 3;
        this.margin = margin;
        this.radius = radius;
        this.radiusWitoutMargin = radius;
        this.width = this.radius * 2;
        this.height = Math.round(Math.sqrt(3) * this.radiusWitoutMargin)/2;
        this.heightWitoutMargin = Math.round(Math.sqrt(3) * this.radius)/2;
        this.cosRadius = Math.round(Math.cos(this.angle) * this.radius);
        this.cosRadiusWitoutMargin = Math.round(Math.cos(this.angle) * this.radiusWitoutMargin);
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
    Hex.prototype.draw = function (self, fillStyle, progress) {
        var that;
        if(self)
            that = self;
        else
            that = this;
        that.context.save();
        if(!fillStyle){
            that.context.strokeStyle = "rgb(35,125,112)";
        }
        else{
            that.context.strokeStyle = fillStyle;
        }
        //that.context.clearRect(that.hexCenter.x - that.radius, that.hexCenter.y - that.height, that.radius, that.height * 2);
        that.context.translate(that.pixelPos.x, that.pixelPos.y);
        that.context.beginPath();
        // if(typeof(progress) !== "undefined" && progress !== null){
        //     var line = Math.round(progress * 6 % 6);
        //     if(line === 0){
        //         that.context.moveTo(that.cosRadiusWitoutMargin, 0);
        //         that.context.lineTo(that.radiusWitoutMargin + that.cosRadiusWitoutMargin,  0);
        //     }
        //     if(line === 1){
        //         that.context.moveTo(that.radiusWitoutMargin + that.cosRadiusWitoutMargin,  0);
        //         that.context.lineTo(that.radiusWitoutMargin + 2 * that.cosRadiusWitoutMargin, that.heightWitoutMargin);
        //     }
        //     if(line === 2){
        //         that.context.moveTo(that.radiusWitoutMargin + 2 * that.cosRadiusWitoutMargin, that.heightWitoutMargin);
        //         that.context.lineTo(that.radiusWitoutMargin + that.cosRadiusWitoutMargin, 2 * that.heightWitoutMargin);
        //     }
        //     if(line === 3){
        //         that.context.moveTo(that.radiusWitoutMargin + that.cosRadiusWitoutMargin, 2 * that.heightWitoutMargin);
        //         that.context.lineTo(that.cosRadiusWitoutMargin, 2 * that.heightWitoutMargin);
        //     }
        //     if(line === 4){
        //         that.context.moveTo(that.cosRadiusWitoutMargin, 2 * that.heightWitoutMargin);
        //         that.context.lineTo(0, that.heightWitoutMargin);
        //     }
        //     if(line === 5){
        //         that.context.moveTo(0, that.heightWitoutMargin);
        //         that.context.lineTo(that.cosRadiusWitoutMargin, 0);
        //     }
        // }
        // else{
            that.context.lineTo(that.cosRadiusWitoutMargin, 0);
            that.context.lineTo(that.radiusWitoutMargin + that.cosRadiusWitoutMargin,  0);
            that.context.lineTo(that.radiusWitoutMargin + 2 * that.cosRadiusWitoutMargin, that.heightWitoutMargin);
            that.context.lineTo(that.radiusWitoutMargin + that.cosRadiusWitoutMargin, 2 * that.heightWitoutMargin);
            that.context.lineTo(that.cosRadiusWitoutMargin, 2 * that.heightWitoutMargin);
            that.context.lineTo(0, that.heightWitoutMargin);
        // }
        that.context.closePath();
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
                    self.context.clearRect(self.hexCenter.x - self.radius, self.hexCenter.y - self. hexCenter, self.radius * 2, self.height * 2);
                    self.draw(self, fillStyle, progress);
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
