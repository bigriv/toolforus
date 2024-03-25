import type { TOUSavable } from "../common/savable";

export class TOUNote implements TOUSavable {
  text: string = "";

  constructor(text?: string) {
    this.text = text ?? "";
  }
}
