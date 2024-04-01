import type { TOUGridContent } from "@/types/tools/designs/colorsuggest/content";

export class TOUGridLayout {
  col: number;
  row: number;
  components: Array<TOUGridContent>;

  constructor(col: number, row: number, components: Array<TOUGridContent>) {
    this.col = col;
    this.row = row;
    this.components = components;
  }
}
