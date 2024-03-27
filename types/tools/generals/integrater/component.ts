import { TOUPosition } from "@/types/common/position";

export enum TOU_COMPONENT_TYPE {
  BASIC_NOTE = "BASIC_NOTE",
  FREEHAND_NOTE = "FREEHAND_NOTE",
  IDEA_MAP = "IDEA_MAP",
  STOP_WATCH = "STOP_WATCH",
  TRANSLATE = "TRANSLATE",
}

export class TOUComponent {
  type: TOU_COMPONENT_TYPE;
  start: TOUPosition;
  end: TOUPosition;
  constructor(type: TOU_COMPONENT_TYPE, start: TOUPosition, end: TOUPosition) {
    this.type = type;
    this.start = start;
    this.end = end;
  }
}
