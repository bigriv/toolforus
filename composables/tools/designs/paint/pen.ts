import { fabric } from "fabric";
import { TOUColor } from "@/types/common/color/color";

export const usePen = (canvas: Ref<fabric.Canvas | undefined>) => {
  const penSetting = reactive({
    color: new TOUColor(TOUColor.CODE_BLACK),
    size: 1,
  });

  // ペンの設定が変わるたびに Fabric.js のブラシ設定へ即時反映する
  watch(
    () => penSetting,
    () => {
      if (!canvas.value) return;
      canvas.value.freeDrawingBrush.color = penSetting.color.getRGBA();
      canvas.value.freeDrawingBrush.width = penSetting.size;
    },
    { deep: true }
  );

  return { penSetting };
};
