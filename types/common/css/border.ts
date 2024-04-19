import { TOUColor } from "@/types/common/color/color";
import type { ConversionableCss } from "@/types/common/css/inteface";

export class TOUBorder implements ConversionableCss {
  radius: string;
  color: TOUColor;
  style:
    | "none"
    | "hidden"
    | "dotted"
    | "dashed"
    | "solid"
    | "double"
    | "groove"
    | "ridge"
    | "inset"
    | "outset";
  constructor(define: {
    radius?: string;
    color?: TOUColor;
    style?:
      | "none"
      | "hidden"
      | "dotted"
      | "dashed"
      | "solid"
      | "double"
      | "groove"
      | "ridge"
      | "inset"
      | "outset";
  }) {
    this.radius = define.radius ?? "0";
    this.color = define.color ?? new TOUColor(TOUColor.CODE_WHITE);
    this.style = define.style ?? "solid";
  }

  convert(): string {
    return `${this.radius} ${this.style} ${this.color.getRGBA()}`;
  }
  getStyle(): string {
    return `border: ${this.convert}`;
  }
}
