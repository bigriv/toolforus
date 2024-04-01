import { TOURGBColor } from "@/types/common/css/color";
import type { ConversionableCss } from "@/types/common/css/inteface";

export class TOUBorder implements ConversionableCss {
  radius: string;
  color: TOURGBColor;
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
    color?: TOURGBColor;
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
    this.color = define.color ?? new TOURGBColor();
    this.style = define.style ?? "solid";
  }

  convert(): string {
    return `${this.radius} ${this.style} ${this.color.rgba()}`;
  }
  getStyle(): string {
    return `border: ${this.convert}`;
  }
}
