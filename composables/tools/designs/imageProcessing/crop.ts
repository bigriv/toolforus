import { fabric } from "fabric";

export const useCrop = (canvas: Ref<fabric.Canvas | undefined>) => {
  const cropping: Ref<{
    target: fabric.Object | undefined;
    clipPath: { backup: fabric.Object | undefined };
  }> = ref({
    target: undefined,
    clipPath: { backup: undefined },
  });

  /**
   * クロップモードを開始する。
   * アクティブオブジェクトを target に保存し、クロップ枠（crop_frame）をキャンバスに追加する。
   * クロップ中は他のオブジェクトを選択不可にする。
   */
  const onCropStart = () => {
    if (!canvas.value) return;
    const object = canvas.value.getActiveObject();
    if (!object) return;
    cropping.value.target = object;
    cropping.value.clipPath.backup = cropping.value.target.clipPath;
    cropping.value.target.clipPath = undefined;

    canvas.value.discardActiveObject();
    canvas.value.getObjects().forEach((o) => (o.selectable = false));

    const cropFrame = new fabric.Rect({
      name: "crop_frame",
      top: cropping.value.target.top,
      left: cropping.value.target.left,
      width:
        (cropping.value.target.width ?? 0) *
        (cropping.value.target.scaleX ?? 1),
      height:
        (cropping.value.target.height ?? 0) *
        (cropping.value.target.scaleY ?? 1),
      fill: "#ffffff",
      opacity: 0.8,
      stroke: "#000000",
      strokeWidth: 1,
    });
    canvas.value.add(cropFrame);
    canvas.value.setActiveObject(cropFrame);
  };

  /** クロップをキャンセルし、元の clipPath を復元してクロップモードを終了する */
  const onCropCancel = () => {
    if (!cropping.value.target) { endCrop(); return; }
    cropping.value.target.clipPath = cropping.value.clipPath.backup;
    endCrop();
  };

  /**
   * クロップ枠の位置・サイズをもとに clipPath を計算してターゲットに適用する。
   * clipPath の座標はターゲットのローカル座標系で指定する必要がある。
   */
  const onCropSubmit = () => {
    if (!canvas.value || !cropping.value.target) { endCrop(); return; }
    const cropFrame = canvas.value
      .getObjects()
      .find((o) => o.name === "crop_frame");
    if (!cropFrame) { endCrop(); return; }

    const parent = {
      width: cropping.value.target.width ?? 0,
      height: cropping.value.target.height ?? 0,
      top: cropping.value.target.top ?? 0,
      left: cropping.value.target.left ?? 0,
      scaleX: cropping.value.target.scaleX ?? 1,
      scaleY: cropping.value.target.scaleY ?? 1,
    };
    const child = {
      width: cropFrame.width ?? 0,
      height: cropFrame.height ?? 0,
      top: cropFrame.top ?? 0,
      left: cropFrame.left ?? 0,
      scaleX: cropFrame.scaleX ?? 1,
      scaleY: cropFrame.scaleY ?? 1,
    };
    const crop = new fabric.Rect({
      top: (child.top - parent.top) / parent.scaleY - parent.height / 2,
      left: (child.left - parent.left) / parent.scaleX - parent.width / 2,
      width: (child.width * child.scaleX) / parent.scaleX,
      height: (child.height * child.scaleY) / parent.scaleY,
    });
    cropping.value.target.set({ clipPath: crop });
    endCrop();
  };

  /**
   * クロップモードを終了する内部関数。
   * target・バックアップをクリアし、crop_frame を削除して全オブジェクトを再選択可能にする。
   */
  const endCrop = () => {
    if (!canvas.value) return;
    cropping.value.target = undefined;
    cropping.value.clipPath.backup = undefined;
    const cropFrame = canvas.value
      .getObjects()
      .find((o) => o.name === "crop_frame");
    if (cropFrame) canvas.value.remove(cropFrame);
    canvas.value.getObjects().forEach((o) => (o.selectable = true));
  };

  return { cropping, onCropStart, onCropCancel, onCropSubmit };
};
