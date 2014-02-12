
    var Radar = function(options) {
        this.ctx = options.ctx || null;
        this.ctx.width = options.width || 0;
        this.ctx.height = options.height || 0;
        this.x = 0;
        this.y = 0;
        this.height = 10;
        this.width = 10;
    };

    Radar.prototype = {
        init: function() {
            var self = this;

            // 绘制圆形
            var R = (self.ctx.width < self.ctx.height) ? (self.ctx.width) : (self.ctx.height);
            var radius = R / 8;
            var X = self.ctx.width / 2;
            var Y = self.ctx.height / 2;

            for (i = 1; i < 4; i++) {
                self.ctx.save();
                self.ctx.lineWidth = 2;
                self.ctx.beginPath();
                self.ctx.arc(0, 0, radius * i, 0, Math.PI * 2, true);
                self.ctx.stroke();
                self.ctx.restore();
            }

            // 绘制坐标线
            self.ctx.save();
            var h_start = -X;
            var h_end = X;
            var v_start = -Y;
            var v_end = Y;
            self.ctx.beginPath();
            self.ctx.moveTo(h_start, 0);
            self.ctx.lineTo(h_end, 0);
            self.ctx.stroke();

            self.ctx.beginPath();
            self.ctx.moveTo(0, v_start);
            self.ctx.lineTo(0, v_end);
            self.ctx.stroke();
            self.ctx.restore();
        },

        point: function(x, y) {
            var self = this;

            // 初始化画布
            self.ctx.save();
            self.ctx.translate(-self.ctx.width/2, -self.ctx.height/2);
            self.ctx.clearRect(0, 0, self.ctx.width, self.ctx.height);
            self.ctx.restore();
            self.init();

            self.x = x;
            self.y = y;

       

            self.ctx.save();
            self.ctx.fillStyle = 'red';
            self.ctx.fillRect((self.x * 75) - self.width / 2, (self.y * 50) - self.height / 2, self.width, self.height);
            self.ctx.restore();
        }
    };



