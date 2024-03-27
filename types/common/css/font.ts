import type { ConversionableCss } from "@/types/common/css/inteface";
import { TOURGBColor } from "@/types/common/css/color";
import type { TOUShadow } from "@/types/common/css/shadow";

export class TOUFont implements ConversionableCss {
  size: number;
  color: TOURGBColor;
  weight: "lighter" | "normal" | "bold";
  family: string;
  shadow: Array<TOUShadow>;

  constructor(define: {
    size: number;
    color?: TOURGBColor;
    weight?: "lighter" | "normal" | "bold";
    family?: string;
    shadow?: Array<TOUShadow>;
  }) {
    this.size = define.size;
    this.color = define.color ?? new TOURGBColor(TOURGBColor.CODE_BLACK);
    this.weight = define.weight ?? "normal";
    this.family = define.family ?? "sans-serif";
    this.shadow = define.shadow ?? [];
  }

  getStyle() {
    return `
    font-size: ${this.size}rem;
    color: ${this.color.rgba()};
    font-weight: ${this.weight};
    font-family: ${this.family};
    font-shadow: ${this.shadow.map((s) => s.converte()).join(",")};
    `;
  }

  setWeight(weight: string) {
    if (!["lighter", "normal", "bold"].includes(weight)) {
      return;
    }
    this.weight = weight as "lighter" | "normal" | "bold";
  }
}
