import { fabric } from "fabric";

export const useIieCanvas = (canvasRef: Ref<HTMLCanvasElement | undefined>) => {
  const toolList = [
    { value: "cursor", icon: "/commons/icons/cursor.svg", label: "選択" },
    { value: "pen", icon: "/commons/icons/pen.svg", label: "ペン" },
    { value: "shape", icon: "/commons/icons/category.svg", label: "図形" },
    { value: "text", icon: "/commons/icons/title.svg", label: "テキスト" },
  ];

  const canvasRatioList = [
    { label: "1:1", value: "one_to_one" },
    { label: "16:9", value: "sixteen_to_nine" },
    { label: "9:16", value: "nine_to_sixteen" },
    { label: "4:3", value: "four_to_three" },
    { label: "2:1", value: "two_to_one" },
    { label: "1:2", value: "one_to_two" },
    { label: "w:h", value: "custom" },
  ];

  const currentTool = ref(toolList[0].value);
  const currentCanvasRatio = ref(canvasRatioList[0].value);
  const size = reactive({ width: 600, height: 600 });

  // shallowRef を使用し、アクセスのたびに新しいインスタンスが生成されるバグを修正
  const canvas = shallowRef<fabric.Canvas | undefined>(undefined);

  const initCanvas = () => {
    if (!canvasRef.value) return;
    canvas.value = new fabric.Canvas(canvasRef.value, {
      preserveObjectStacking: true,
    });
    canvas.value.setWidth(size.width).setHeight(size.height);
  };

  const onChangeCanvasRatio = () => {
    if (!canvas.value) return;
    switch (currentCanvasRatio.value) {
      case "one_to_one":
        canvas.value.setWidth(600).setHeight(600);
        size.width = 600; size.height = 600;
        break;
      case "sixteen_to_nine":
        canvas.value.setWidth(800).setHeight(450);
        size.width = 800; size.height = 450;
        break;
      case "nine_to_sixteen":
        canvas.value.setWidth(450).setHeight(800);
        size.width = 450; size.height = 800;
        break;
      case "four_to_three":
        canvas.value.setWidth(800).setHeight(600);
        size.width = 800; size.height = 600;
        break;
      case "two_to_one":
        canvas.value.setWidth(800).setHeight(400);
        size.width = 800; size.height = 400;
        break;
      case "one_to_two":
        canvas.value.setWidth(300).setHeight(600);
        size.width = 300; size.height = 600;
        break;
      case "custom":
        canvas.value.setWidth(size.width).setHeight(size.height);
        break;
    }
  };

  const onChangeCanvasSize = () => {
    if (!canvas.value) return;
    canvas.value.setWidth(size.width).setHeight(size.height);
  };

  const onChangeTool = () => {
    if (!canvas.value) return;
    canvas.value.isDrawingMode = currentTool.value === "pen";
  };

  return {
    toolList,
    canvasRatioList,
    canvas,
    size,
    currentCanvasRatio,
    currentTool,
    initCanvas,
    onChangeCanvasRatio,
    onChangeTool,
    onChangeCanvasSize,
  };
};
