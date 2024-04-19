import { fabric } from "fabric";
import { TOUColor } from "@/types/common/color/color";

export const useIiePen = (canvas: ComputedRef<fabric.Canvas>) => {
  const penSetting = reactive({
    color: new TOUColor(TOUColor.CODE_BLACK),
    size: 1,
  });
  watch(
    () => penSetting,
    () => {
      canvas.value.freeDrawingBrush.color = penSetting.color.getRGBA();
      canvas.value.freeDrawingBrush.width = penSetting.size;
    },
    { deep: true }
  );

  return {
    penSetting,
  };
};
