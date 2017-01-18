var globalCanvas = document.getElementsByTagName("canvas").item(0);
var globalContext = globalCanvas.getContext("2d");
globalContext.translate(0.5, 0.5);
var Rect = (function () {
    function Rect() {
    }
    return Rect;
}());
var Buffer = (function () {
    function Buffer(width, height) {
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
    }
    Buffer.prototype.drawRect = function (rect) {
        var x = rect.x, y = rect.y, w = rect.w, h = rect.h;
        var oldFillStyle = this.context.fillStyle;
        this.context.fillStyle = "#f00";
        this.context.fillRect(x, y, w, h);
        this.context.fillStyle = oldFillStyle;
    };
    Buffer.prototype.renderToContext = function (target) {
        target.drawImage(this.canvas, 0, 0);
    };
    return Buffer;
}());
var buff = new Buffer(500, 500);
buff.drawRect({ x: 100, y: 100, w: 100, h: 100 });
buff.renderToContext(globalContext);
