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
  private static TempBuffer: Buffer;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  width: number;
  height: number;

  constructor(width: number, height: number, props: undefined | { isTemporaryBuffer: boolean } = undefined) {
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
    (this.context as any).msImageSmoothingEnabled = false;
    (this.context as any).imageSmoothingEnabled = false;

    this.context.save();

    // http://stackoverflow.com/questions/41372133/html5-canvas-fillrect-bleeding
    this.context.clearRect(0, 0, this.width, this.height);

    if (!Buffer.TempBuffer && (!props || props && props.isTemporaryBuffer === false)) {
      Buffer.TempBuffer = new Buffer(this.width, this.height, { isTemporaryBuffer: true });
    }
  }

  drawRect(rect: Rect): void {
    const { x, y, w, h } = rect;

    const oldFillStyle = this.context.fillStyle;

    this.context.fillStyle = "#f00";
    this.context.fillRect(x, y, w, h);
    this.context.fillStyle = oldFillStyle;
  }

  rotate(about: { x: number, y: number }, degrees: number): Buffer {
    Buffer.TempBuffer.context.clearRect(0, 0, Buffer.TempBuffer.width, Buffer.TempBuffer.height);

    Buffer.TempBuffer.context.save();
    Buffer.TempBuffer.context.translate(about.x, about.y);
    Buffer.TempBuffer.context.rotate(degrees * Math.PI / 180);

    this.renderToContext(Buffer.TempBuffer.context, { x: -about.x, y: -about.y });

    Buffer.TempBuffer.context.restore();

    return Buffer.TempBuffer;
  }

  scale(about: { x: number, y: number }, amount: { x: number, y: number }): Buffer {
    Buffer.TempBuffer.context.clearRect(0, 0, Buffer.TempBuffer.width, Buffer.TempBuffer.height);

    Buffer.TempBuffer.context.save();
    Buffer.TempBuffer.context.translate(about.x, about.y);
    Buffer.TempBuffer.context.scale(amount.x, amount.y);

    this.renderToContext(Buffer.TempBuffer.context, { x: -about.x, y: -about.y });

    Buffer.TempBuffer.context.restore();

    return Buffer.TempBuffer;
  }

  translate(amount: { x: number, y: number }): void {
    const id = this.context.getImageData(0, 0, 500, 500);
    const newid = new ImageData(500, 500);

    const datalen = id.data.length;

    for (let i = 0; i < datalen - 1; i++) {
      newid.data[i] = id.data[i + 1];
    }

    this.context.putImageData(newid, 0, 0);
  }

  renderToContext(target: CanvasRenderingContext2D, point: { x: number, y: number }): void {
    target.drawImage(this.canvas, point.x, point.y);
  }
}

const buff = new Buffer(500, 500);

buff.drawRect({ x: 100, y: 100, w: 100, h: 100 });

let i = 0.0;

setInterval(() => {
  buff.renderToContext(globalContext, { x: 0, y: 0 });
  // globalContext.clearRect(0, 0, 500, 500);

  buff.translate({ x: 0, y: i++ })
}, 10);