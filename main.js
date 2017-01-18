var globalCanvas = document.getElementsByTagName("canvas").item(0);
var globalContext = globalCanvas.getContext("2d");
globalContext.translate(0.5, 0.5);
var Rect = (function () {
    function Rect() {
    }
    return Rect;
}());
var Buffer = (function () {
    function Buffer(width, height, props) {
        if (props === void 0) { props = undefined; }
        this.canvas = document.createElement('canvas');
        this.width = width;
        this.height = height;
        this.canvas.width = width;
        this.canvas.height = height;
        var context = this.canvas.getContext('2d');
        if (context) {
            this.context = context;
        }
        this.context.mozImageSmoothingEnabled = false;
        this.context.webkitImageSmoothingEnabled = false;
        this.context.msImageSmoothingEnabled = false;
        this.context.imageSmoothingEnabled = false;
        this.context.save();
        // http://stackoverflow.com/questions/41372133/html5-canvas-fillrect-bleeding
        this.context.clearRect(0, 0, this.width, this.height);
        if (!props || (props && !props.isTemporaryBuffer)) {
            this.tempBuffer = new Buffer(this.width, this.height, { isTemporaryBuffer: true });
        }
    }
    Buffer.prototype.drawRect = function (rect) {
        var x = rect.x, y = rect.y, w = rect.w, h = rect.h;
        var oldFillStyle = this.context.fillStyle;
        this.context.fillStyle = "#f00";
        this.context.fillRect(x, y, w, h);
        this.context.fillStyle = oldFillStyle;
    };
    Buffer.prototype.rotate = function (about, degrees) {
        this.tempBuffer.context.save();
        this.tempBuffer.context.translate(about.x, about.y);
        this.tempBuffer.context.rotate(degrees * Math.PI / 180);
        this.renderToContext(this.tempBuffer.context, { x: -about.x, y: -about.y });
        this.tempBuffer.context.restore();
        return this.tempBuffer;
    };
    Buffer.prototype.scale = function (about, amount) {
        this.tempBuffer.context.save();
        this.tempBuffer.context.translate(about.x, about.y);
        this.tempBuffer.context.scale(amount.x, amount.y);
        this.renderToContext(this.tempBuffer.context, { x: -about.x, y: -about.y });
        this.tempBuffer.context.restore();
        return this.tempBuffer;
    };
    Buffer.prototype.renderToContext = function (target, point) {
        target.drawImage(this.canvas, point.x, point.y);
    };
    return Buffer;
}());
var buff = new Buffer(500, 500);
buff.drawRect({ x: 100, y: 100, w: 100, h: 100 });
var i = 1;
setInterval(function () {
    globalContext.clearRect(0, 0, 500, 500);
    var newBuff = buff.scale({ x: 100, y: 100 }, { x: i += 0.01, y: 1 });
    newBuff.renderToContext(globalContext, { x: 0, y: 0 });
}, 10);
