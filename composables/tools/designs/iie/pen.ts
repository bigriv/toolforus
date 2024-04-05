import { fabric } from "fabric";
import { TOURGBColor } from "@/types/common/css/color";

export const useIiePen = (canvas: ComputedRef<fabric.Canvas>) => {
  const penSetting = reactive({
    color: new TOURGBColor(TOURGBColor.CODE_BLACK),
    size: 1,
  });
  watch(
    () => penSetting,
    () => {
      canvas.value.freeDrawingBrush.color = penSetting.color.rgba();
      canvas.value.freeDrawingBrush.width = penSetting.size;
    },
    { deep: true }
  );

  return {
    penSetting,
  };
};
