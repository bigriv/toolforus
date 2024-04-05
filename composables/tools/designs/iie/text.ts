import { fabric } from "fabric";
import { TOURGBColor } from "@/types/common/css/color";

export const useIieText = (canvas: ComputedRef<fabric.Canvas>) => {
  const textSetting = reactive({
    text: "テキスト",
    size: 20,
    color: new TOURGBColor(TOURGBColor.CODE_BLACK),
    stroke: new TOURGBColor(TOURGBColor.CODE_BLACK),
    strokeWidth: 0,
  });

  watch(
    () => textSetting,
    () => {
      const activeTexts = canvas.value
        .getActiveObjects()
        .filter((object) => object instanceof fabric.Text);
      if (activeTexts.length !== 1) {
        return;
      }
      const text = activeTexts[0] as fabric.Text;
      if (!text.text || /^\s*$/.test(text.text)) {
        return;
      }
      text.text = textSetting.text;
      text.set({
        fontSize: textSetting.size,
        fill: textSetting.color.rgba(),
        stroke: textSetting.stroke.rgba(),
        strokeWidth: textSetting.strokeWidth,
      });
      canvas.value.renderAll();
    },
    { deep: true }
  );

  const resetTextSetting = () => {
    textSetting.text = "テキスト";
    textSetting.size = 20;
    textSetting.color = new TOURGBColor(TOURGBColor.CODE_BLACK);
    textSetting.stroke = new TOURGBColor(TOURGBColor.CODE_BLACK);
    textSetting.strokeWidth = 0;
  };

  const reflectTextSetting = () => {
    resetTextSetting();
    const activeTexts = canvas.value
      .getActiveObjects()
      .filter((object) => object instanceof fabric.Text);
    if (activeTexts.length !== 1) {
      // Textが一つも選択状態になっていないか複数選択されている場合は何もしない
      return;
    }
    const text = activeTexts[0] as fabric.Text;

    textSetting.text = text.text ?? "";
    textSetting.size = text.fontSize ?? 10;
    textSetting.color =
      TOURGBColor.rgbaToRGBAColor(text.fill as string) ??
      new TOURGBColor(TOURGBColor.CODE_BLACK);
    textSetting.stroke =
      TOURGBColor.rgbaToRGBAColor(text.stroke as string) ??
      new TOURGBColor(TOURGBColor.CODE_BLACK);
    textSetting.strokeWidth = text.strokeWidth ?? 0;
  };

  const generateTextObject = (position: {
    x: number;
    y: number;
  }): fabric.Text => {
    return new fabric.Text(textSetting.text, {
      top: position.y,
      left: position.x,
      fontSize: textSetting.size,
      fill: textSetting.color.rgba(),
      stroke: textSetting.stroke.rgba(),
      strokeWidth: textSetting.strokeWidth,
    });
  };
  return {
    textSetting,
    reflectTextSetting,
    generateTextObject,
  };
};
