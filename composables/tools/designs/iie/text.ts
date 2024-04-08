import { fabric } from "fabric";
import { TOURGBColor } from "@/types/common/css/color";

export const useIieText = (canvas: ComputedRef<fabric.Canvas>) => {
  const textSetting = reactive({
    backup: {
      color: new TOURGBColor(TOURGBColor.CODE_BLACK),
      stroke: new TOURGBColor(TOURGBColor.CODE_BLACK),
    },
    text: "テキスト",
    size: 20,
    color: new TOURGBColor(TOURGBColor.CODE_BLACK),
    stroke: new TOURGBColor(TOURGBColor.CODE_BLACK),
    strokeWidth: 0,
  });

  watch(
    () => [
      textSetting.size,
      textSetting.color,
      textSetting.stroke,
      textSetting.strokeWidth,
    ],
    () => {
      const activeTexts = canvas.value
        .getActiveObjects()
        .filter((object) => object instanceof fabric.Text);
      if (activeTexts.length !== 1) {
        return;
      }
      const text = activeTexts[0] as fabric.Text;

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
    textSetting.text = /^\s*$/.test(textSetting.text)
      ? "テキスト"
      : textSetting.text;
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

    textSetting.text = text.text ?? "テキスト";
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

  const backupTextSetting = () => {
    const activeTexts = canvas.value
      .getActiveObjects()
      .filter((object) => object instanceof fabric.Text);
    if (activeTexts.length !== 1) {
      return;
    }
    const text = activeTexts[0] as fabric.Text;

    textSetting.backup.color =
      TOURGBColor.rgbaToRGBAColor(text.fill as string) ??
      new TOURGBColor(TOURGBColor.CODE_BLACK);
    textSetting.backup.stroke =
      TOURGBColor.rgbaToRGBAColor(text.stroke as string) ??
      new TOURGBColor(TOURGBColor.CODE_BLACK);

  };
  const rollbackTextSetting = () => {
    textSetting.color = textSetting.backup.color;
    textSetting.stroke = textSetting.backup.stroke;
  };

  const onChangeText = () => {
    const activeTexts = canvas.value
      .getActiveObjects()
      .filter((object) => object instanceof fabric.Text);
    if (activeTexts.length !== 1) {
      return;
    }

    const text = activeTexts[0] as fabric.Text;
    if (!textSetting.text || /^\s*$/.test(textSetting.text)) {
      return;
    }

    // テキストの変更を即座に変更するために一度オブジェクトをキャンバスから削除する
    canvas.value.remove(text);
    canvas.value.discardActiveObject();

    // 同じ設定で新しいTextオブジェクトを追加
    const newText = new fabric.Text(textSetting.text, {
      top: text.top,
      left: text.left,
      fontSize: text.fontSize,
      fill: text.fill,
      stroke: text.stroke,
      strokeWidth: text.strokeWidth,
    });
    canvas.value.setActiveObject(newText);
    canvas.value.add(newText);

    canvas.value.renderAll();
  };

  return {
    textSetting,
    reflectTextSetting,
    generateTextObject,
    backupTextSetting,
    rollbackTextSetting,
    onChangeText,
  };
};
