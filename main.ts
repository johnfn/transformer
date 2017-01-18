const globalCanvas = document.getElementsByTagName("canvas").item(0);
const globalContext = globalCanvas.getContext("2d")!;

globalContext.translate(0.5, 0.5);

class Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

class Buffer {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  width: number;
  height: number;

  constructor(width: number, height: number) {
    this.canvas = document.createElement('canvas');

    this.width = width;
    this.height = height;

    this.canvas.width = width;
    this.canvas.height = height;

    const context = this.canvas.getContext('2d');

    if (context) {
      this.context = context;
    }

    this.context.mozImageSmoothingEnabled = false;
    this.context.webkitImageSmoothingEnabled = false;
    this.context.msImageSmoothingEnabled = false;
    (this.context as any).imageSmoothingEnabled = false;

    this.context.save();

    // http://stackoverflow.com/questions/41372133/html5-canvas-fillrect-bleeding
    this.context.clearRect(0, 0, this.width, this.height);
  }

  drawRect(rect: Rect): void {
    const { x, y, w, h } = rect;

    const oldFillStyle = this.context.fillStyle;

    this.context.fillStyle = "#f00";
    this.context.fillRect(x, y, w, h);
    this.context.fillStyle = oldFillStyle;
  }

  rotate(about: { x: number, y: number }, degrees: number): Buffer {
    const tempBuffer = new Buffer(this.width, this.height);

    tempBuffer.context.save();
    tempBuffer.context.translate(about.x, about.y);
    tempBuffer.context.rotate(degrees * Math.PI / 180);

    this.renderToContext(tempBuffer.context, { x: -about.x, y: -about.y });

    tempBuffer.context.restore();

    return tempBuffer;
  }

  scale(about: { x: number, y: number }, point: { x: number, y: number }): Buffer {

  }

  renderToContext(target: CanvasRenderingContext2D, point: { x: number, y: number }): void {
    target.drawImage(this.canvas, point.x, point.y);
  }
}

const buff = new Buffer(500, 500);

buff.drawRect({ x: 100, y: 100, w: 100, h: 100 });

let i = 0;

setInterval(() => {
  globalContext.clearRect(0, 0, 500, 500);

  const newBuff = buff.rotate({ x: 150, y: 150 }, i += 5);
  newBuff.renderToContext(globalContext, { x: 0, y: 0 });
}, 10);