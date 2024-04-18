import type { TOUBorder } from "@/types/common/css/border";
import type { TOUColor } from "@/types/common/color";
import type { TOUFont } from "@/types/common/css/font";
import type { TOUPosition } from "@/types/common/position";

export class TOUGridContent {
  start: TOUPosition;
  end: TOUPosition;
  background: TOUColor;
  border?: TOUBorder;
  text?: string;
  font?: TOUFont;

  constructor(define: {
    start: TOUPosition;
    end: TOUPosition;
    background: TOUColor;
    border?: TOUBorder;
    text?: string;
    font?: TOUFont;
  }) {
    this.start = define.start;
    this.end = define.end;
    this.background = define.background;
    this.border = define.border;
    this.text = define.text;
    this.font = define.font;
  }
}
