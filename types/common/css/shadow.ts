import { TOUColor } from "@/types/common/color/color";

export class TOUShadow {
  vertical: number;
  horizontal: number;
  blur?: number;
  spread?: number;
  color: TOUColor;

  constructor(define: {
    vertical: number;
    horizontal: number;
    blur?: number;
    spread?: number;
    color?: TOUColor;
  }) {
    this.vertical = define.vertical;
    this.horizontal = define.horizontal;
    this.blur = define.blur;
    this.spread = define.spread;
    this.color = define.color ?? new TOUColor(TOUColor.CODE_BLACK);
  }

  convert(): string {
    let style = "";
    style += this.vertical + "rem ";
    style += this.horizontal + "rem ";
    if (this.blur) {
      style += this.blur + "rem ";
    }
    if (this.spread) {
      style += this.spread + "rem ";
    }
    style += this.color.getRGBA();
    return style;
  }
}
