<script setup lang="ts">
import { fabric } from "fabric";
import BasicDialog from "@/components/atoms/BasicDialog.vue";
import ToolButton from "@/components/atoms/interfaces/ToolButton.vue";
import ToolFileButton from "@/components/atoms/interfaces/ToolFileButton.vue";
import ToolRadioButtons from "@/components/atoms/interfaces/ToolRadioButtons.vue";
import InputNumber from "@/components/molecules/interfaces/InputNumber.vue";
import InputSlideAndNumber from "@/components/molecules/interfaces/InputSlideAndNumber.vue";
import InputColorToolButton from "@/components/organisms/interfaces/InputColorToolButton.vue";
import { TOURGBColor } from "@/types/common/css/color";

const toolList = [
  {
    value: "cursor",
    icon: "/commons/icons/cursor.svg",
  },
  {
    value: "pen",
    icon: "/commons/icons/pen.svg",
  },
  {
    value: "shape",
    icon: "/commons/icons/category.svg",
  },
];

const shpaes = [
  {
    value: "circle",
    icon: "/commons/icons/circle.svg",
  },
  {
    value: "triangle",
    icon: "/commons/icons/triangle.svg",
  },
  {
    value: "square",
    icon: "/commons/icons/square.svg",
  },
];

const canvasRef = ref<HTMLCanvasElement>();
const size = reactive({
  width: 500,
  height: 600,
});
const currentTool = ref(toolList[0].value);
const currentShape = ref(shpaes[0].value);
const canvas = computed(
  () =>
    new fabric.Canvas(canvasRef.value!, {
      preserveObjectStacking: true,
    })
);
const mouse = ref({
  isDown: false,
  drag: {
    start: {
      x: 0,
      y: 0,
    },
    end: { x: 0, y: 0 },
  },
});
const penSetting = reactive({
  color: new TOURGBColor(TOURGBColor.CODE_BLACK),
  size: 1,
});
const shapeSetting = reactive({
  fill: new TOURGBColor(TOURGBColor.CODE_LIGHT_GRAY),
  border: new TOURGBColor(TOURGBColor.CODE_BLACK),
  borderWidth: 1,
});
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
const filter = reactive({
  isShowModal: false,
  contrast: 0,
  hueRotation: 0,
  saturation: 0,
  brightness: 0,
  blur: 0,
  opacity: 100,
});
const resetFilter = () => {
  filter.contrast = 0;
  filter.hueRotation = 0;
  filter.saturation = 0;
  filter.brightness = 0;
  filter.blur = 0;
  filter.opacity = 100;
};
const selectedObjects = ref<fabric.Object[]>([]);
const isSelectingShape = computed(
  () => selectedObjects.value.filter((object) => isShape(object)).length > 0
);
const isSelectingImage = computed(
  () =>
    selectedObjects.value.filter((object) => object instanceof fabric.Image)
      .length > 0
);
watch(
  () => penSetting,
  () => {
    canvas.value.freeDrawingBrush.color = penSetting.color.rgba();
    canvas.value.freeDrawingBrush.width = penSetting.size;
  },
  { deep: true }
);

const onMouseDown = (options: fabric.IEvent) => {
  if (!options.pointer) {
    return;
  }
  if (options.target) {
    return;
  }
  mouse.value.drag.start.x = options.pointer.x;
  mouse.value.drag.start.y = options.pointer.y;
  mouse.value.isDown = true;
};

const onMouseMove = (options: fabric.IEvent) => {
  if (!options.pointer) {
    return;
  }
  mouse.value.drag.end.x = options.pointer.x;
  mouse.value.drag.end.y = options.pointer.y;
};
const onMouseUp = (options: fabric.IEvent) => {
  if (!mouse.value.isDown) {
    return;
  }
  mouse.value.isDown = false;
  if (!options.pointer) {
    return;
  }
  const width = mouse.value.drag.end.x - mouse.value.drag.start.x;
  const height = mouse.value.drag.end.y - mouse.value.drag.start.y;
  if (width <= 0 || height <= 0) {
    return;
  }
  if (currentTool.value === "shape") {
    const shape = generateShape(width, height);
    if (shape) {
      canvas.value.add(shape);
    }
  }
};

const generateShape = (
  width: number,
  height: number
): fabric.Object | undefined => {
  const defaultFill = TOURGBColor.CODE_LIGHT_GRAY;
  const defaultStroke = TOURGBColor.CODE_BLACK;
  switch (currentShape.value) {
    case "circle":
      return new fabric.Ellipse({
        left: mouse.value.drag.start.x,
        top: mouse.value.drag.start.y,
        rx: width / 2,
        ry: height / 2,
        fill: defaultFill,
        opacity: 1,
        angle: 0,
        stroke: defaultStroke,
        strokeWidth: 1,
        strokeUniform: true,
      });
    case "square":
      return new fabric.Rect({
        left: mouse.value.drag.start.x,
        top: mouse.value.drag.start.y,
        width: width,
        height: height,
        fill: defaultFill,
        opacity: 1,
        stroke: defaultStroke,
        strokeWidth: 1,
        strokeUniform: true,
      });
    case "triangle":
      return new fabric.Triangle({
        left: mouse.value.drag.start.x,
        top: mouse.value.drag.start.y,
        width: width,
        height: height,
        fill: defaultFill,
        opacity: 1,
        stroke: defaultStroke,
        strokeWidth: 1,
        strokeUniform: true,
      });
  }
  return undefined;
};
const onUpdateSelectingObjects = () => {
  selectedObjects.value = canvas.value.getActiveObjects();
  resetShapeSetting();
  resetFilter();
};
const initCanvas = () => {
  canvas.value.clear(); // 以前の描画をクリア
  canvas.value.isDrawingMode = false;
  canvas.value.on("mouse:down", onMouseDown);
  canvas.value.on("mouse:move", onMouseMove);
  canvas.value.on("mouse:up", onMouseUp);
  canvas.value.on("selection:created", onUpdateSelectingObjects);
  canvas.value.on("selection:updated", onUpdateSelectingObjects);
  canvas.value.on("selection:cleared", onUpdateSelectingObjects);
  canvas.value.setWidth(size.width).setHeight(size.height);
  return canvas;
};

const onChangeFile = (event: Event) => {
  const files = (event.target as HTMLInputElement)?.files;

  if (!files || files.length <= 0) {
    return;
  }

  const reader = new FileReader();

  reader.onload = (event: Event) => {
    if (!canvasRef.value) {
      return;
    }

    const imageData = (event.target as FileReader).result;
    if (!imageData) {
      return;
    }

    fabric.Image.fromURL(
      imageData instanceof ArrayBuffer
        ? Buffer.from(imageData).toString()
        : imageData,
      (img) => {
        if (!canvasRef.value) {
          return;
        }
        // 画像をFabric.jsのImageオブジェクトに読み込む
        canvas.value.add(img); // Canvasに画像を追加
      }
    );
  };

  reader.readAsDataURL(files[0]); // 画像の読み込みを開始
};

const onExport = () => {
  const dataURL = canvas.value.toDataURL({
    format: "png", // 画像の形式を指定（デフォルトはpng）
    quality: 1, // 画像の品質を指定（0〜1の範囲、デフォルトは1）
  });

  // データURLを画像としてダウンロードする方法
  // 例えば、ダウンロード用のリンクを作成し、クリックしたときにダウンロードさせる
  var link = document.createElement("a");
  link.href = dataURL;
  link.download = "image.png"; // ダウンロードする画像のファイル名を指定
  link.click();
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
    canvas.value.freeDrawingBrush.color = penSetting.color.code;
    canvas.value.freeDrawingBrush.width = penSetting.size;
  } else {
    canvas.value.isDrawingMode = false;
  }
};
const onDeleteObjects = () => {
  canvas.value.getActiveObjects().forEach((object) => {
    canvas.value.remove(object);
  });
  canvas.value.discardActiveObject();
};
const onChangeShapeSetting = () => {
  canvas.value.getActiveObjects().forEach((object) => {
    if (!isShape(object)) {
      return;
    }
    object.set({
      fill: shapeSetting.fill.rgba(),
      stroke: shapeSetting.border.rgba(),
      strokeWidth: shapeSetting.borderWidth,
    });
  });
  canvas.value.renderAll();
};
const onChangeFilter = () => {
  canvas.value.getActiveObjects().forEach((object) => {
    if (!(object instanceof fabric.Image)) {
      return;
    }
    object.filters = [];
    object.applyFilters([
      new fabric.Image.filters.Contrast({
        contrast: filter.contrast / 100,
      }),
      new fabric.Image.filters.HueRotation({
        rotation: filter.hueRotation / 100,
      }),
      new fabric.Image.filters.Blur({
        blur: filter.blur / 100,
      }),
      new fabric.Image.filters.Brightness({
        brightness: filter.brightness / 100,
      }),
      new fabric.Image.filters.Saturation({
        saturation: filter.saturation / 100,
      }),
    ]);
    object.set({
      opacity: filter.opacity / 100,
    });
  });
  canvas.value.renderAll();
};
onMounted(() => {
  initCanvas();
});
</script>

<template>
  <div class="c-container">
    <div class="c-container__toolbar">
      <div class="c-container__toolbar__menu">
        <ToolFileButton
          accept=".jpeg,.png,.bmp,.tiff,.gif"
          icon="/commons/icons/upload_file.svg"
          @change="onChangeFile"
        />
        <ToolButton @click="onExport">
          <img src="/commons/icons/download.svg" />
        </ToolButton>
        <div class="c-container__toolbar__menu__input">
          <div class="c-container__toolbar__menu__input__label">Width</div>
          <div class="c-container__toolbar__menu__input__text">
            <InputNumber
              v-model="size.width"
              :min="1"
              :max="2000"
              @update:modelValue="onChangteCanvasSize"
            />
          </div>
        </div>
        <div class="c-container__toolbar__menu__input">
          <div class="c-container__toolbar__menu__input__label">Height</div>
          <div class="c-container__toolbar__menu__input__text">
            <InputNumber
              v-model="size.height"
              :min="1"
              :max="2000"
              @update:modelValue="onChangteCanvasSize"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="c-container__toolbar">
      <div class="c-container__toolbar__menu">
        <ToolRadioButtons
          v-model:selected="currentTool"
          name="tool"
          :list="toolList"
          @change="onChangeTool"
        />
      </div>
    </div>
    <div class="c-container__toolbar">
      <div class="c-container__toolbar__menu">
        <template v-if="currentTool === 'cursor'">
          <template v-if="isSelectingShape">
            <InputColorToolButton
              v-model:color="shapeSetting.fill"
              icon="/commons/icons/colors.svg"
              @submit="onChangeShapeSetting"
            />
            <InputColorToolButton
              v-model:color="shapeSetting.border"
              icon="/commons/icons/pen.svg"
              @submit="onChangeShapeSetting"
            />
            <div class="c-container__toolbar__menu__input">
              <img src="/commons/icons/line_weight.svg" alt="ボーダーの太さ" />
              <div class="c-container__toolbar__menu__input__text">
                <InputNumber
                  v-model="shapeSetting.borderWidth"
                  :min="0"
                  :max="100"
                  @blur="onChangeShapeSetting"
                />
              </div>
            </div>
          </template>
          <div
            v-if="isSelectingImage"
            class="c-container__toolbar__menu__modal_wrap"
          >
            <ToolButton @click="filter.isShowModal = true">
              <img src="/commons/icons/swap_driving_apps_wheel.svg" />
            </ToolButton>
            <div class="c-container__toolbar__menu__modal_wrap__modal">
              <BasicDialog
                v-model:isShowModal="filter.isShowModal"
                @submit="onChangeFilter"
              >
                <div class="c-container__toolbar__menu__filter">
                  <div>コントラスト</div>
                  <InputSlideAndNumber
                    v-model="filter.contrast"
                    :max="100"
                    :min="-100"
                  />
                </div>
                <div class="c-container__toolbar__menu__filter">
                  <div>明度</div>
                  <InputSlideAndNumber
                    v-model="filter.brightness"
                    :max="100"
                    :min="-100"
                  />
                </div>
                <div class="c-container__toolbar__menu__filter">
                  <div>彩度</div>
                  <InputSlideAndNumber
                    v-model="filter.saturation"
                    :max="100"
                    :min="-100"
                  />
                </div>
                <div class="c-container__toolbar__menu__filter">
                  <div>色相</div>
                  <InputSlideAndNumber
                    v-model="filter.hueRotation"
                    :max="100"
                    :min="-100"
                  />
                </div>
                <div class="c-container__toolbar__menu__filter">
                  <div>ぼかし</div>
                  <InputSlideAndNumber
                    v-model="filter.blur"
                    :max="100"
                    :min="0"
                  />
                </div>
                <div class="c-container__toolbar__menu__filter">
                  <div>透明度</div>
                  <InputSlideAndNumber
                    v-model="filter.opacity"
                    :max="100"
                    :min="0"
                  />
                </div>
              </BasicDialog>
            </div>
          </div>
          <ToolButton @click="onDeleteObjects">
            <img src="/commons/icons/delete.svg" />
          </ToolButton>
        </template>
        <template v-else-if="currentTool === 'pen'">
          <InputColorToolButton
            v-model:color="penSetting.color"
            icon="/commons/icons/pen.svg"
          />
          <div class="c-container__toolbar__menu__input">
            <img src="/commons/icons/line_weight.svg" alt="ペンサイズ" />
            <div class="c-container__toolbar__menu__input__text">
              <InputNumber
                v-model="penSetting.size"
                :min="1"
                :max="72"
                mode="uint"
              />
            </div>
          </div>
        </template>
        <template v-else-if="currentTool === 'shape'">
          <ToolRadioButtons
            v-model:selected="currentShape"
            name="shape"
            :list="shpaes"
          />
        </template>
      </div>
    </div>
    <div class="c-container__editer">
      <div
        class="c-container__editer__canvas"
        :class="{
          'u-mouse_icon--pen': currentTool === 'pen',
        }"
      >
        <canvas ref="canvasRef"></canvas>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.c-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  &__toolbar {
    display: flex;
    justify-content: space-between;
    background-color: white;
    height: 2rem;
    &__menu {
      display: flex;
      &__tool {
        position: relative;
      }
      &__input {
        display: flex;
        align-items: center;
        padding: 0 0.4rem;
        gap: 0.4rem;
        border: 0.1rem solid black;
        &__text {
          width: 6em;
          height: 80%;
        }
      }
      &__modal_wrap {
        position: relative;
        &__modal {
          position: absolute;
          top: 0;
          left: 2.4rem;
        }
      }
      &__filter {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 0 0.4rem;
        white-space: pre;
      }
    }
  }
  &__editer {
    position: relative;
    width: 100%;
    font-family: sans-serif;
    white-space: pre;
    flex-grow: 1;
    border: 0.1rem solid black;
    overflow: scroll;
    background-color: #eee;
    &__canvas {
      width: fit-content;
      margin: auto;
      border: 0.1rem solid black;
      background-color: white;
    }
  }
}
.u-mouse_icon--pen {
  :deep(canvas.upper-canvas) {
    cursor: inherit !important;
  }
}
</style>
