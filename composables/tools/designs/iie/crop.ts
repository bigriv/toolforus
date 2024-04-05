import { fabric } from "fabric";

export const useIieCrop = (canvas: ComputedRef<fabric.Canvas>) => {
  const cropping: Ref<{
    target: fabric.Object | undefined;
    clipPath: {
      before: fabric.Object | undefined;
    };
  }> = ref({
    target: undefined,
    clipPath: {
      before: undefined,
    },
  });

  const onCropStart = () => {
    const object = canvas.value.getActiveObject();
    if (!object) {
      return;
    }
    cropping.value.target = object;
    cropping.value.clipPath.before = cropping.value.target.clipPath;
    cropping.value.target.clipPath = undefined;

    // キャンバス内のオブジェクトの選択を解除し、選択不可にする
    canvas.value.discardActiveObject();
    canvas.value.getObjects().forEach((object) => (object.selectable = false));

    // トリミング用の枠を生成
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
  const onCropCancel = () => {
    if (!cropping.value.target) {
      endCrop();
      return;
    }
    cropping.value.target.clipPath = cropping.value.clipPath.before;
    endCrop();
  };
  const onCropSubmit = () => {
    if (!cropping.value.target) {
      endCrop();
      return;
    }
    const cropFrame = canvas.value
      .getObjects()
      .find((object) => object.name === "crop_frame");
    if (!cropFrame) {
      endCrop();
      return;
    }

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

    cropping.value.target.set({
      clipPath: crop,
    });
    endCrop();
  };
  const endCrop = () => {
    cropping.value.target = undefined;
    cropping.value.clipPath.before = undefined;
    const cropFrame = canvas.value
      .getObjects()
      .find((object) => object.name === "crop_frame");
    if (cropFrame) {
      canvas.value.remove(cropFrame);
    }
    canvas.value.getObjects().forEach((object) => (object.selectable = true));
  };

  return {
    cropping,
    onCropStart,
    onCropCancel,
    onCropSubmit,
  };
};
