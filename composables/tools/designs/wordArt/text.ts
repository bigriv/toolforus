import { fabric } from "fabric";
import { TOUColor } from "@/types/common/color/color";

export const useText = (canvas: Ref<fabric.Canvas | undefined>) => {
  const textSetting = reactive({
    /** カラーピッカーキャンセル時に戻すためのバックアップ値 */
    backup: {
      color: new TOUColor(TOUColor.CODE_BLACK),
      stroke: new TOUColor(TOUColor.CODE_BLACK),
    },
    text: "テキスト",
    size: 20,
    color: new TOUColor(TOUColor.CODE_BLACK),
    stroke: new TOUColor(TOUColor.CODE_BLACK),
    strokeWidth: 0,
  });

  // サイズ・色・ストロークが変わるたびにアクティブなテキストオブジェクトへ即時反映する
  watch(
    () => [textSetting.size, textSetting.color, textSetting.stroke, textSetting.strokeWidth],
    () => {
      if (!canvas.value) return;
      const activeTexts = canvas.value
        .getActiveObjects()
        .filter((object) => object instanceof fabric.Text);
      if (activeTexts.length !== 1) return;
      const text = activeTexts[0] as fabric.Text;
      text.set({
        fontSize: textSetting.size,
        fill: textSetting.color.getRGBA(),
        stroke: textSetting.stroke.getRGBA(),
        strokeWidth: textSetting.strokeWidth,
      });
      canvas.value.renderAll();
    },
    { deep: true }
  );

  /** フォント設定をデフォルト値にリセットする（空白テキストはプレースホルダーに戻す） */
  const resetTextSetting = () => {
    textSetting.text = /^\s*$/.test(textSetting.text) ? "テキスト" : textSetting.text;
    textSetting.size = 20;
    textSetting.color = new TOUColor(TOUColor.CODE_BLACK);
    textSetting.stroke = new TOUColor(TOUColor.CODE_BLACK);
    textSetting.strokeWidth = 0;
  };

  /** アクティブなテキストオブジェクトの現在値をフォント設定に反映する（選択変更後に呼ぶ） */
  const reflectTextSetting = () => {
    resetTextSetting();
    if (!canvas.value) return;
    const activeTexts = canvas.value
      .getActiveObjects()
      .filter((object) => object instanceof fabric.Text);
    if (activeTexts.length !== 1) return;
    const text = activeTexts[0] as fabric.Text;
    textSetting.text = text.text ?? "テキスト";
    textSetting.size = text.fontSize ?? 10;
    textSetting.color =
      TOUColor.rgbaToInstance(text.fill as string) ??
      new TOUColor(TOUColor.CODE_BLACK);
    textSetting.stroke =
      TOUColor.rgbaToInstance(text.stroke as string) ??
      new TOUColor(TOUColor.CODE_BLACK);
    textSetting.strokeWidth = text.strokeWidth ?? 0;
  };

  /** フォント設定の現在値でテキストオブジェクトを生成して返す */
  const generateTextObject = (position: { x: number; y: number }): fabric.Text => {
    return new fabric.Text(textSetting.text, {
      top: position.y,
      left: position.x,
      fontSize: textSetting.size,
      fill: textSetting.color.getRGBA(),
      stroke: textSetting.stroke.getRGBA(),
      strokeWidth: textSetting.strokeWidth,
    });
  };

  /** カラーピッカーを開く前に現在のフォント設定をバックアップする */
  const backupTextSetting = () => {
    if (!canvas.value) return;
    const activeTexts = canvas.value
      .getActiveObjects()
      .filter((object) => object instanceof fabric.Text);
    if (activeTexts.length !== 1) return;
    const text = activeTexts[0] as fabric.Text;
    textSetting.backup.color =
      TOUColor.rgbaToInstance(text.fill as string) ??
      new TOUColor(TOUColor.CODE_BLACK);
    textSetting.backup.stroke =
      TOUColor.rgbaToInstance(text.stroke as string) ??
      new TOUColor(TOUColor.CODE_BLACK);
  };

  /** バックアップした値にフォント設定を戻す（カラーピッカーキャンセル時に呼ぶ） */
  const rollbackTextSetting = () => {
    textSetting.color = textSetting.backup.color;
    textSetting.stroke = textSetting.backup.stroke;
  };

  /**
   * テキスト内容を変更する。
   * Fabric.js の Text は text プロパティを直接変更できないため、
   * 既存オブジェクトを削除して同じプロパティで新規オブジェクトを生成する。
   */
  const onChangeText = () => {
    if (!canvas.value) return;
    const activeTexts = canvas.value
      .getActiveObjects()
      .filter((object) => object instanceof fabric.Text);
    if (activeTexts.length !== 1) return;
    const text = activeTexts[0] as fabric.Text;
    if (!textSetting.text || /^\s*$/.test(textSetting.text)) return;

    canvas.value.remove(text);
    canvas.value.discardActiveObject();

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
