import { fabric } from "fabric";

export const useIieTransform = (canvas: Ref<fabric.Canvas | undefined>) => {
  const isUpdatingFromCanvas = ref(false);

  const transform = reactive({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    angle: 0,
    flipX: false,
    flipY: false,
  });

  const reflectTransform = () => {
    const obj = canvas.value?.getActiveObject();
    if (!obj) return;
    isUpdatingFromCanvas.value = true;
    transform.x = Math.round(obj.left ?? 0);
    transform.y = Math.round(obj.top ?? 0);
    transform.width = Math.round((obj.width ?? 0) * (obj.scaleX ?? 1));
    transform.height = Math.round((obj.height ?? 0) * (obj.scaleY ?? 1));
    transform.angle = Math.round(obj.angle ?? 0);
    transform.flipX = obj.flipX ?? false;
    transform.flipY = obj.flipY ?? false;
    nextTick(() => {
      isUpdatingFromCanvas.value = false;
    });
  };

  const applyTransform = () => {
    if (isUpdatingFromCanvas.value) return;
    const obj = canvas.value?.getActiveObject();
    if (!obj) return;
    const objWidth = obj.width ?? 1;
    const objHeight = obj.height ?? 1;
    obj.set({
      left: transform.x,
      top: transform.y,
      scaleX: objWidth > 0 ? transform.width / objWidth : 1,
      scaleY: objHeight > 0 ? transform.height / objHeight : 1,
      angle: transform.angle,
    });
    obj.setCoords();
    canvas.value?.renderAll();
  };

  const flipHorizontal = () => {
    const obj = canvas.value?.getActiveObject();
    if (!obj) return;
    obj.set({ flipX: !obj.flipX });
    transform.flipX = !transform.flipX;
    canvas.value?.renderAll();
  };

  const flipVertical = () => {
    const obj = canvas.value?.getActiveObject();
    if (!obj) return;
    obj.set({ flipY: !obj.flipY });
    transform.flipY = !transform.flipY;
    canvas.value?.renderAll();
  };

  watch(
    () => [transform.x, transform.y, transform.width, transform.height, transform.angle],
    () => {
      if (isUpdatingFromCanvas.value) return;
      applyTransform();
    }
  );

  return { transform, reflectTransform, flipHorizontal, flipVertical };
};
