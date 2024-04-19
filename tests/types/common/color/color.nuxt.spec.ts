import { expect, it } from "vitest";
import { TOUColor } from "@/types/common/color/color";

it("color white", () => {
  const code = TOUColor.CODE_WHITE;
  const color = new TOUColor(code);
  expect(color.code).toBe(code);
  expect(color.alpha).toBe(1);
});
it("color black opacity any", () => {
  const code = TOUColor.CODE_BLACK;
  const opacity = 0.8;
  const color = new TOUColor(code, opacity);
  expect(color.code).toBe(code);
  expect(color.alpha).toBe(opacity);
});
