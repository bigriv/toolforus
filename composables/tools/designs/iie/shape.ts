import { fabric } from "fabric";
import { TOURGBColor } from "@/types/common/css/color";

export const useIieShape = (canvas: ComputedRef<fabric.Canvas>) => {
  const shpaeList = [
    {
      value: "circle",
      icon: "/commons/icons/circle.svg",
      label: "円",
    },
    {
      value: "triangle",
      icon: "/commons/icons/triangle.svg",
      label: "三角",
    },
    {
      value: "square",
      icon: "/commons/icons/square.svg",
      label: "四角",
    },
  ];
  const currentShape = ref(shpaeList[0].value);

  const shapeSetting = reactive({
    backup: {
      fill: new TOURGBColor(TOURGBColor.CODE_LIGHT_GRAY),
      border: new TOURGBColor(TOURGBColor.CODE_BLACK),
    },
    fill: new TOURGBColor(TOURGBColor.CODE_LIGHT_GRAY),
    border: new TOURGBColor(TOURGBColor.CODE_BLACK),
    borderWidth: 1,
  });

  watch(
    () => shapeSetting,
    () => {
      const activeShapes = canvas.value
        .getActiveObjects()
        .filter((object) => isShape(object));
      if (activeShapes.length !== 1) {
        return;
      }
      const shpae = activeShapes[0] as fabric.Object;
      shpae.set({
        fill: shapeSetting.fill.rgba(),
        stroke: shapeSetting.border.rgba(),
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
    shapeSetting.fill = new TOURGBColor(TOURGBColor.CODE_LIGHT_GRAY);
    shapeSetting.border = new TOURGBColor(TOURGBColor.CODE_BLACK);
    shapeSetting.borderWidth = 1;
  };

  const reflectShapeSetting = () => {
    resetShapeSetting();
    const activeShapes = canvas.value
      .getActiveObjects()
      .filter((object) => isShape(object));
    if (activeShapes.length !== 1) {
      // 図形が一つも選択状態になっていないか複数選択されている場合は何もしない
      return;
    }
    const shape = activeShapes[0] as fabric.Object;
    shapeSetting.fill =
      TOURGBColor.rgbaToRGBAColor(shape.fill as string) ??
      new TOURGBColor(TOURGBColor.CODE_LIGHT_GRAY);
    shapeSetting.border =
      TOURGBColor.rgbaToRGBAColor(shape.stroke as string) ??
      new TOURGBColor(TOURGBColor.CODE_BLACK);
    shapeSetting.borderWidth = shape.strokeWidth ?? 1;
  };

  const generateShape = (
    start: {
      x: number;
      y: number;
    },
    end: {
      x: number;
      y: number;
    }
  ): fabric.Object | undefined => {
    const width = end.x - start.x;
    const height = end.y - start.y;
    if (width <= 0 || height <= 0) {
      return undefined;
    }
    const defaultFill = TOURGBColor.CODE_LIGHT_GRAY;
    const defaultStroke = TOURGBColor.CODE_BLACK;
    switch (currentShape.value) {
      case "circle":
        return new fabric.Ellipse({
          left: start.x,
          top: start.y,
          rx: width / 2,
          ry: height / 2,
          fill: defaultFill,
          opacity: 1,
          angle: 0,
          stroke: defaultStroke,
          strokeWidth: 1,
        });
      case "square":
        return new fabric.Rect({
          left: start.x,
          top: start.y,
          width: width,
          height: height,
          fill: defaultFill,
          opacity: 1,
          stroke: defaultStroke,
          strokeWidth: 1,
        });
      case "triangle":
        return new fabric.Triangle({
          left: start.x,
          top: start.y,
          width: width,
          height: height,
          fill: defaultFill,
          opacity: 1,
          stroke: defaultStroke,
          strokeWidth: 1,
        });
    }
    return undefined;
  };
  const backupShapeSetting = () => {
    const activeShpaes = canvas.value
      .getActiveObjects()
      .filter((object) => isShape(object));
    if (activeShpaes.length !== 1) {
      return;
    }
    const shape = activeShpaes[0] as fabric.Object;

    shapeSetting.backup.fill =
      TOURGBColor.rgbaToRGBAColor(shape.fill as string) ??
      new TOURGBColor(TOURGBColor.CODE_BLACK);
    shapeSetting.backup.border =
      TOURGBColor.rgbaToRGBAColor(shape.stroke as string) ??
      new TOURGBColor(TOURGBColor.CODE_BLACK);
  };
  const rollbackShapeSetting = () => {
    shapeSetting.fill = shapeSetting.backup.fill;
    shapeSetting.border = shapeSetting.backup.border;
  };
  return {
    shpaeList,
    shapeSetting,
    currentShape,
    isShape,
    reflectShapeSetting,
    generateShape,
    backupShapeSetting,
    rollbackShapeSetting,
  };
};
