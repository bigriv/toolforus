import { fabric } from "fabric";

export const useIieCanvas = (canvasRef: Ref<HTMLCanvasElement | undefined>) => {
  const toolList = [
    {
      value: "cursor",
      icon: "/commons/icons/cursor.svg",
      label: "選択",
    },
    {
      value: "pen",
      icon: "/commons/icons/pen.svg",
      label: "ペン",
    },
    {
      value: "shape",
      icon: "/commons/icons/category.svg",
      label: "図形",
    },
    {
      value: "text",
      icon: "/commons/icons/title.svg",
      label: "テキスト",
    },
  ];

  const canvasRatioList = [
    {
      label: "1:1",
      value: "one_to_one",
    },
    {
      label: "16:9",
      value: "sixteen_to_nine",
    },
    {
      label: "9:16",
      value: "nine_to_sixteen",
    },
    {
      label: "4:3",
      value: "four_to_three",
    },
    {
      label: "2:1",
      value: "two_to_one",
    },
    {
      label: "1:2",
      value: "one_to_two",
    },
    {
      label: "w:h",
      value: "custom",
    },
  ];

  const currentTool = ref(toolList[0].value);
  const currentCanvasRatio = ref(canvasRatioList[0].value);
  const size = reactive({
    width: 500,
    height: 600,
  });
  const canvas = computed(
    () =>
      new fabric.Canvas(canvasRef.value!, {
        preserveObjectStacking: true,
      })
  );

  const onChangeCanvasRatio = () => {
    switch (currentCanvasRatio.value) {
      case "one_to_one":
        canvas.value.setWidth(600).setHeight(600);
        break;
      case "sixteen_to_nine":
        canvas.value.setWidth(800).setHeight(450);
        break;
      case "nine_to_sixteen":
        canvas.value.setWidth(450).setHeight(800);
        break;
      case "four_to_three":
        canvas.value.setWidth(800).setHeight(600);
        break;
      case "two_to_one":
        canvas.value.setWidth(800).setHeight(400);
        break;
      case "one_to_two":
        canvas.value.setWidth(300).setHeight(600);
        break;
      case "custom":
        canvas.value.setWidth(size.width).setHeight(size.height);
        break;
    }
  };
  const onChangteCanvasSize = () => {
    canvas.value.setWidth(size.width).setHeight(size.height);
  };
  const onChangeTool = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (!target?.value) {
      return;
    }
    if (target.value === "pen") {
      canvas.value.isDrawingMode = true;
    } else {
      canvas.value.isDrawingMode = false;
    }
  };

  return {
    toolList,
    canvasRatioList,
    canvas,
    size,
    currentCanvasRatio,
    currentTool,
    onChangeCanvasRatio,
    onChangeTool,
    onChangteCanvasSize,
  };
};
