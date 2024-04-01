import { TOURGBColor } from "@/types/common/css/color";

export class TOUShadow {
  vertical: number;
  horizontal: number;
  blur?: number;
  spread?: number;
  color: TOURGBColor;

  constructor(define: {
    vertical: number;
    horizontal: number;
    blur?: number;
    spread?: number;
    color?: TOURGBColor;
  }) {
    this.vertical = define.vertical;
    this.horizontal = define.horizontal;
    this.blur = define.blur;
    this.spread = define.spread;
    this.color = define.color ?? new TOURGBColor(TOURGBColor.CODE_BLACK);
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
    style += this.color.rgba();
    return style;
  }
}
