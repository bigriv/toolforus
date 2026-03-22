import { fabric } from "fabric";
import { TOUColor } from "@/types/common/color/color";

export const useIieShape = (canvas: Ref<fabric.Canvas | undefined>) => {
  const shapeList = [
    { value: "circle", icon: "/commons/icons/circle.svg", label: "円" },
    { value: "triangle", icon: "/commons/icons/triangle.svg", label: "三角" },
    { value: "square", icon: "/commons/icons/square.svg", label: "四角" },
  ];
  const currentShape = ref(shapeList[0].value);

  const shapeSetting = reactive({
    backup: {
      fill: new TOUColor(TOUColor.CODE_LIGHT_GRAY),
      border: new TOUColor(TOUColor.CODE_BLACK),
    },
    fill: new TOUColor(TOUColor.CODE_LIGHT_GRAY),
    border: new TOUColor(TOUColor.CODE_BLACK),
    borderWidth: 1,
  });

  watch(
    () => shapeSetting,
    () => {
      if (!canvas.value) return;
      const activeShapes = canvas.value
        .getActiveObjects()
        .filter((object) => isShape(object));
      if (activeShapes.length !== 1) return;
      const shape = activeShapes[0] as fabric.Object;
      shape.set({
        fill: shapeSetting.fill.getRGBA(),
        stroke: shapeSetting.border.getRGBA(),
        strokeWidth: shapeSetting.borderWidth,
      });
      canvas.value.renderAll();
    },
    { deep: true }
  );

  const isShape = (object: fabric.Object) => {
    return (
      object instanceof fabric.Ellipse ||
      object instanceof fabric.Rect ||
      object instanceof fabric.Triangle
    );
  };

  const resetShapeSetting = () => {
    shapeSetting.fill = new TOUColor(TOUColor.CODE_LIGHT_GRAY);
    shapeSetting.border = new TOUColor(TOUColor.CODE_BLACK);
    shapeSetting.borderWidth = 1;
  };

  const reflectShapeSetting = () => {
    resetShapeSetting();
    if (!canvas.value) return;
    const activeShapes = canvas.value
      .getActiveObjects()
      .filter((object) => isShape(object));
    if (activeShapes.length !== 1) return;
    const shape = activeShapes[0] as fabric.Object;
    shapeSetting.fill =
      TOUColor.rgbaToInstance(shape.fill as string) ??
      new TOUColor(TOUColor.CODE_LIGHT_GRAY);
    shapeSetting.border =
      TOUColor.rgbaToInstance(shape.stroke as string) ??
      new TOUColor(TOUColor.CODE_BLACK);
    shapeSetting.borderWidth = shape.strokeWidth ?? 1;
  };

  const generateShape = (
    start: { x: number; y: number },
    end: { x: number; y: number }
  ): fabric.Object | undefined => {
    const width = end.x - start.x;
    const height = end.y - start.y;
    if (width <= 0 || height <= 0) return undefined;
    const defaultFill = TOUColor.CODE_LIGHT_GRAY;
    const defaultStroke = TOUColor.CODE_BLACK;
    switch (currentShape.value) {
      case "circle":
        return new fabric.Ellipse({
          left: start.x, top: start.y,
          rx: width / 2, ry: height / 2,
          fill: defaultFill, opacity: 1, angle: 0,
          stroke: defaultStroke, strokeWidth: 1,
        });
      case "square":
        return new fabric.Rect({
          left: start.x, top: start.y,
          width, height,
          fill: defaultFill, opacity: 1,
          stroke: defaultStroke, strokeWidth: 1,
        });
      case "triangle":
        return new fabric.Triangle({
          left: start.x, top: start.y,
          width, height,
          fill: defaultFill, opacity: 1,
          stroke: defaultStroke, strokeWidth: 1,
        });
    }
    return undefined;
  };

  const backupShapeSetting = () => {
    if (!canvas.value) return;
    const activeShapes = canvas.value
      .getActiveObjects()
      .filter((object) => isShape(object));
    if (activeShapes.length !== 1) return;
    const shape = activeShapes[0] as fabric.Object;
    shapeSetting.backup.fill =
      TOUColor.rgbaToInstance(shape.fill as string) ??
      new TOUColor(TOUColor.CODE_BLACK);
    shapeSetting.backup.border =
      TOUColor.rgbaToInstance(shape.stroke as string) ??
      new TOUColor(TOUColor.CODE_BLACK);
  };

  const rollbackShapeSetting = () => {
    shapeSetting.fill = shapeSetting.backup.fill;
    shapeSetting.border = shapeSetting.backup.border;
  };

  return {
    shapeList,
    shapeSetting,
    currentShape,
    isShape,
    reflectShapeSetting,
    generateShape,
    backupShapeSetting,
    rollbackShapeSetting,
  };
};
