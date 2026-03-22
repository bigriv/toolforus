import { fabric } from "fabric";
import { TOUColor } from "@/types/common/color/color";

export const useIiePen = (canvas: Ref<fabric.Canvas | undefined>) => {
  const penSetting = reactive({
    color: new TOUColor(TOUColor.CODE_BLACK),
    size: 1,
  });

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
