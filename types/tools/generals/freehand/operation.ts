import { TOUColor } from "@/types/common/color/color";
import { TOUPosition } from "@/types/common/position";

/**
 * 手書きメモの操作抽象クラス
 */
export abstract class TOUFreehandNoteOperation {
  abstract reproduce(
    canvas: HTMLCanvasElement,
    drawer: CanvasRenderingContext2D
  ): void;

  abstract toJson(): { name: string } & any;

  static build(object: any): TOUFreehandNoteOperation | undefined {
    if (object.name === "clear") {
      return new TOUFreehandNoteClear();
    } else if (object.name === "draw") {
      const drawing = TOUFreehandNoteDraw.build(object);
      if (!drawing) {
        return undefined;
      }
      return drawing;
    }
    return undefined;
  }
}

/**
 * 手書きメモのクリア操作
 */
export class TOUFreehandNoteClear extends TOUFreehandNoteOperation {
  constructor() {
    super();
  }

  reproduce(canvas: HTMLCanvasElement, drawer: CanvasRenderingContext2D): void {
    drawer.clearRect(0, 0, canvas.width, canvas.height);
  }

  toJson(): Object {
    return {
      name: "clear",
    };
  }
}

/**
 * 手書きメモの線描画操作
 */
export class TOUFreehandNoteDraw extends TOUFreehandNoteOperation {
  readonly color: TOUColor;
  readonly penSize: number;
  readonly isErase: boolean;
  path: TOUPosition[];

  constructor(args: {
    x: number;
    y: number;
    color: TOUColor;
    size: number;
    isErase?: boolean;
  }) {
    super();
    this.color = args.color;
    this.penSize = args.size;
    this.isErase = args.isErase ?? false;
    this.path = [new TOUPosition(args.x, args.y)];
  }

  addPath(x: number, y: number) {
    this.path.push(new TOUPosition(x, y));
  }

  reproduce(
    __canvas: HTMLCanvasElement,
    drawer: CanvasRenderingContext2D
  ): void {
    if (this.path.length <= 0) {
      return;
    }

    drawer.beginPath();
    drawer.moveTo(this.path[0].x, this.path[0].y);

    if (this.isErase) {
      drawer.globalCompositeOperation = "destination-out";
    } else {
      drawer.globalCompositeOperation = "source-over";
      drawer.globalAlpha = this.color.alpha;
      drawer.strokeStyle = this.color.code;
    }
    for (let i = 1; i < this.path.length; i++) {
      drawer.lineTo(this.path[i].x, this.path[i].y);
      drawer.lineCap = "round";
      drawer.lineWidth = this.penSize;
      drawer.stroke();
    }
  }

  toJson(): Object {
    return {
      name: "draw",
      color: {
        code: this.color.code,
        alpha: this.color.alpha,
      },
      penSize: this.penSize,
      isErase: this.isErase,
      path: this.path.map((point) => {
        return { x: point.x, y: point.y };
      }),
    };
  }

  static build(object: any): TOUFreehandNoteDraw | undefined {
    if (!object || object.name !== "draw") {
      return undefined;
    }
    const color = new TOUColor(TOUColor.CODE_BLACK);
    if (object.color) {
      if (typeof object.color.code === "string") {
        color.setColor(object.color.code);
      }
      if (typeof object.color.alpha === "number") {
        color.setAlpha(object.color.alpha);
      }
    }

    const penSize = typeof object.penSize === "number" ? object.penSize : 1;
    const isErase =
      typeof object.isErase === "boolean" ? object.isErase : false;
    const path = new Array<{ x: number; y: number }>();
    if (Array.isArray(object.path)) {
      for (const point of object.path) {
        if (typeof point.x !== "number") {
          continue;
        }
        if (typeof point.y !== "number") {
          continue;
        }
        path.push({ x: point.x, y: point.y });
      }
    }
    if (path.length <= 0) {
      return undefined;
    }
    const drawing = new TOUFreehandNoteDraw({
      x: path[0].x,
      y: path[0].y,
      color: color,
      size: penSize,
      isErase: isErase,
    });
    for (let i = 1; i < path.length; i++) {
      drawing.addPath(path[i].x, path[i].y);
    }
    return drawing;
  }
}
