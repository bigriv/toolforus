import type { TOUPosition } from "@/types/common/position";

export class TOUIntroduction {
  name: string;
  position: TOUPosition;
  radius: number;
  fontSize: number;
  children: TOUIntroduction[];
  constructor(
    name: string,
    position: TOUPosition,
    radius: number,
    fontSize: number,
    children?: TOUIntroduction[]
  ) {
    this.name = name;
    this.position = position;
    this.radius = radius;
    this.fontSize = fontSize;
    this.children = children ?? [];
  }
}
