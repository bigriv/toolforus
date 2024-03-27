import { TOURGBColor } from "@/types/common/css/color";
import { TOUFont } from "@/types/common/css/font";
import { TOUShadow } from "@/types/common/css/shadow";
import { TOUPosition } from "@/types/common/position";
import type { TOUSavable } from "@/types/common/savable";

export class TOUIdea implements TOUSavable {
  children: TOUIdea[];
  text: string;
  width: number;
  height: number;
  font: TOUFont;
  position: TOUPosition;

  constructor(define: { position: TOUPosition }) {
    this.children = [];
    this.text = "";
    this.width = 6;
    this.height = 2;
    this.font = new TOUFont({
      size: 1,
    });
    this.position = define.position;
  }

  getLeft(): number {
    return this.position.x - this.width / 2;
  }
  getRight(): number {
    return this.position.x + this.width / 2;
  }
  getTop(): number {
    return this.position.y - this.height / 2;
  }
  getBottom(): number {
    return this.position.y + this.height / 2;
  }
  isOverwarap(idea: TOUIdea) {
    for (const child of this.children) {
      if (child.isOverwarap(idea)) {
        return true;
      }
    }

    if (idea.getRight() < this.getLeft()) {
      // 対象の右端がこのオブジェクトの左端より左側なら重なっていないとみなす
      return false;
    }
    if (idea.getLeft() > this.getRight()) {
      // 対象の左端がこのオブジェクトの右端より右側なら重なっていないとみなす
      return false;
    }
    if (idea.getBottom() < this.getTop()) {
      // 対象の下端がこのオブジェクトの上端より上側なら重なっていないとみなす
      return false;
    }
    if (idea.getTop() > this.getBottom()) {
      // 対象の上端がこのオブジェクトの下端より下側なら重なっていないとみなす
      return false;
    }
    return true;
  }

  static build(object: any): TOUIdea {
    const idea = new TOUIdea({ position: new TOUPosition() });
    if (object.children && Array.isArray(object.children)) {
      for (const child of object.children) {
        idea.children.push(TOUIdea.build(child));
      }
    }
    if (object.text && typeof object.text === "string") {
      idea.text = object.text;
    }
    if (object.width && typeof object.width === "number") {
      idea.width = object.width;
    }
    if (object.height && typeof object.height === "number") {
      idea.height = object.height;
    }
    if (object.font && typeof object.font === "object") {
      let shadow = [];
      if (Array.isArray(object.font.shadow)) {
        shadow = object.font.shadow.map(
          (s: any) =>
            new TOUShadow({
              vertical: s.vertical,
              horizontal: s.horizontal,
              blur: s.blur,
              spread: s.spread,
              color: new TOURGBColor(s.color?.code, s?.opacity),
            })
        );
      }
      idea.font = new TOUFont({
        size: object.font.size,
        color: new TOURGBColor(
          object.font.color?.code,
          object.font.color?.opacity
        ),
        weight: object.font.weight,
        family: object.font.family,
        shadow: shadow,
      });
    }
    if (object.position && typeof object.position === "object") {
      idea.position.x = object.position.x;
      idea.position.y = object.position.y;
    }
    return idea;
  }
}
