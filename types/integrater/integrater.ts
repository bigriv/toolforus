import { TOUPosition } from "../common/position";
import type { TOUSavable } from "../common/savable";
import { TOUComponent, TOU_COMPONENT_TYPE } from "./component";

export class TOUIntegrater implements TOUSavable {
  components: Array<TOUComponent>;
  constructor() {
    this.components = [];
  }

  static build(object: any): TOUIntegrater {
    const integrater = new TOUIntegrater();
    if (!Array.isArray(object)) {
      console.log("object is not array");
      return integrater;
    }
    const components = Array<TOUComponent>();
    for (const content of object) {
      if (typeof content.type !== "string") {
        console.log("content type is not string");
        continue;
      }
      if (
        !Object.keys(TOU_COMPONENT_TYPE).includes(
          content.type as TOU_COMPONENT_TYPE
        )
      ) {
        console.log("content type is not defined");
        continue;
      }
      const component = new TOUComponent(
        content.type as TOU_COMPONENT_TYPE,
        new TOUPosition(),
        new TOUPosition()
      );

      if (typeof content.start === "object") {
        if (typeof content.start.x === "number") {
          component.start.x = content.start.x;
        }
        if (typeof content.start.y === "number") {
          component.start.y = content.start.y;
        }
      }

      if (typeof content.end === "object") {
        if (typeof content.end.x === "number") {
          component.end.x = content.end.x;
        }
        if (typeof content.end.y === "number") {
          component.end.y = content.end.y;
        }
      }

      components.push(component);
    }
    integrater.components = components;
    return integrater;
  }
}
