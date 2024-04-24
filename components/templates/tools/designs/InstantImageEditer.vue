<script setup lang="ts">
import { fabric } from "fabric";
import BasicDialog from "@/components/atoms/BasicDialog.vue";
import InputText from "@/components/atoms/interfaces/InputText.vue";
import ToolButton from "@/components/atoms/interfaces/ToolButton.vue";
import ToolFileButton from "@/components/atoms/interfaces/ToolFileButton.vue";
import ToolRadioButtons from "@/components/atoms/interfaces/ToolRadioButtons.vue";
import InputNumber from "@/components/molecules/interfaces/InputNumber.vue";
import InputSlideAndNumber from "@/components/molecules/interfaces/InputSlideAndNumber.vue";
import ToolInputText from "@/components/molecules/interfaces/ToolInputText.vue";
import ToolInputNumber from "@/components/molecules/interfaces/ToolInputNumber.vue";
import InputColorToolButton from "@/components/organisms/interfaces/InputColorToolButton.vue";
import { useShortcutKey } from "@/composables/common/shortcut";
import { useIieCanvas } from "@/composables/tools/designs/iie/canvas";
import { useIieFile } from "@/composables/tools/designs/iie/file";
import { useIieFilter } from "@/composables/tools/designs/iie/filter";
import { useIiePen } from "@/composables/tools/designs/iie/pen";
import { useIieShape } from "@/composables/tools/designs/iie/shape";
import { useIieCrop } from "@/composables/tools/designs/iie/crop";
import { useIieText } from "@/composables/tools/designs/iie/text";

const canvasRef = ref<HTMLCanvasElement>();

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

const {
  toolList,
  canvasRatioList,
  canvas,
  size,
  currentCanvasRatio,
  currentTool,
  onChangeCanvasRatio,
  onChangeTool,
  onChangteCanvasSize,
} = useIieCanvas(canvasRef);
const {
  extensionList,
  exportFile,
  onOpenExportModal,
  onImport,
  onExport,
  onDropFile,
} = useIieFile(canvas);
const { filter, reflectFilter, backupFilter, rollbackFilter } =
  useIieFilter(canvas);
const { penSetting } = useIiePen(canvas);
const {
  shpaeList,
  shapeSetting,
  currentShape,
  isShape,
  reflectShapeSetting,
  generateShape,
  backupShapeSetting,
  rollbackShapeSetting,
} = useIieShape(canvas);
const { cropping, onCropStart, onCropCancel, onCropSubmit } =
  useIieCrop(canvas);
const {
  textSetting,
  reflectTextSetting,
  generateTextObject,
  backupTextSetting,
  rollbackTextSetting,
  onChangeText,
} = useIieText(canvas);
const { addShortcutKey, removeShortcutKey } = useShortcutKey([
  {
    code: "Delete",
    onKeydown: () => onDeleteObjects(),
  },
  {
    code: "Escape",
    onKeydown: () => {
      canvas.value.discardActiveObject();
      canvas.value.renderAll();
    },
  },
]);
const selectedObjects = ref<fabric.Object[]>([]);
const isSelectingShape = computed(
  () => selectedObjects.value.filter((object) => isShape(object)).length === 1
);
const isSelectingImage = computed(
  () =>
    selectedObjects.value.filter((object) => object instanceof fabric.Image)
      .length === 1
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

  if (currentTool.value === "shape") {
    const shape = generateShape(mouse.value.drag.start, mouse.value.drag.end);
    if (shape) {
      canvas.value.add(shape);
    }
  } else if (currentTool.value === "text") {
    if (mouse.value.drag.end.x - mouse.value.drag.start.x <= 0) {
      return;
    }
    if (mouse.value.drag.end.y - mouse.value.drag.start.y <= 0) {
      return;
    }
    canvas.value.add(generateTextObject(mouse.value.drag.start));
    return;
  }
};

const onUpdateSelectingObjects = () => {
  selectedObjects.value = canvas.value.getActiveObjects();
  if (currentTool.value === "cursor") {
    reflectFilter();
  } else if (currentTool.value === "shape") {
    reflectShapeSetting();
  } else if (currentTool.value === "text") {
    reflectTextSetting();
  }
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
  canvas.value.freeDrawingBrush.color = penSetting.color.code;
  canvas.value.freeDrawingBrush.width = penSetting.size;
  return canvas;
};

const onOpenFilterSetting = () => {
  backupFilter();
  filter.isShowModal = true;
};
const onDeleteObjects = () => {
  canvas.value.getActiveObjects().forEach((object) => {
    canvas.value.remove(object);
  });
  canvas.value.discardActiveObject();
};

onMounted(() => {
  initCanvas();
  addShortcutKey();
});
onUnmounted(() => {
  removeShortcutKey();
});
</script>

<template>
  <div class="c-container">
    <div class="c-container__toolbar">
      <div class="c-container__toolbar__menu">
        <ToolFileButton
          accept=".jpeg,.png,.bmp,.tiff,.gif"
          icon="/commons/icons/upload_file.svg"
          label="インポート"
          @change="onImport"
        />
        <ToolButton
          icon="/commons/icons/download.svg"
          label="エクスポート"
          @click="onOpenExportModal"
        />
        <ToolRadioButtons
          v-model:selected="currentCanvasRatio"
          name="canvas_ratio"
          :list="canvasRatioList"
          @change="onChangeCanvasRatio"
        />
        <template v-if="currentCanvasRatio === 'custom'">
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
        </template>
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
        <template v-if="cropping.target">
          <ToolButton
            icon="/commons/icons/flag.svg"
            label="適用"
            @click="onCropSubmit"
          />
          <ToolButton
            icon="/commons/icons/close.svg"
            label="キャンセル"
            @click="onCropCancel"
          />
        </template>
        <template v-else>
          <template v-if="currentTool === 'cursor'">
            <template v-if="isSelectingShape">
              <InputColorToolButton
                v-model:color="shapeSetting.fill"
                icon="/commons/icons/colors.svg"
                label="図形の塗りつぶし色"
                @open="backupShapeSetting"
                @cancel="rollbackShapeSetting"
              />
              <InputColorToolButton
                v-model:color="shapeSetting.border"
                icon="/commons/icons/pen.svg"
                label="図形の枠線色"
                @open="backupShapeSetting"
                @cancel="rollbackShapeSetting"
              />
              <ToolInputNumber
                v-model="shapeSetting.borderWidth"
                :min="0"
                :max="100"
                icon="/commons/icons/line_weight.svg"
                label="図形の枠線太さ"
              />
            </template>
            <template v-if="isSelectingImage">
              <div class="c-container__toolbar__menu__modal_wrap">
                <ToolButton
                  icon="/commons/icons/swap_driving_apps_wheel.svg"
                  label="フィルター"
                  @click="onOpenFilterSetting"
                />
                <div class="c-container__toolbar__menu__modal_wrap__modal">
                  <BasicDialog
                    v-model:isShowModal="filter.isShowModal"
                    @cancel="rollbackFilter"
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
              <ToolButton
                icon="/commons/icons/crop.svg"
                label="トリミング"
                @click="onCropStart"
              />
            </template>
            <ToolButton
              icon="/commons/icons/delete.svg"
              label="削除"
              @click="onDeleteObjects"
            />
          </template>
          <template v-else-if="currentTool === 'pen'">
            <InputColorToolButton
              v-model:color="penSetting.color"
              icon="/commons/icons/pen.svg"
              label="ペンの色"
            />
            <ToolInputNumber
              v-model="penSetting.size"
              :min="1"
              :max="72"
              mode="uint"
              icon="/commons/icons/line_weight.svg"
              label="ペンサイズ"
            />
          </template>
          <template
            v-else-if="currentTool === 'crop' || currentTool === 'shape'"
          >
            <ToolRadioButtons
              v-model:selected="currentShape"
              name="shape"
              :list="shpaeList"
            />
          </template>
          <template v-else-if="currentTool === 'text'">
            <div class="c-container__toolbar__menu__text">
              <ToolInputText
                v-model="textSetting.text"
                placeholder="テキスト"
                :maxlength="100"
                icon="/commons/icons/title.svg"
                label="テキスト"
                @update:modelValue="onChangeText"
              />
            </div>
            <ToolInputNumber
              v-model="textSetting.size"
              :min="10"
              :max="72"
              mode="uint"
              icon="/commons/icons/font_size.svg"
              label="フォントサイズ"
            />
            <InputColorToolButton
              v-model:color="textSetting.color"
              icon="/commons/icons/colors.svg"
              label="テキストの塗りつぶし色"
              @open="backupTextSetting"
              @cancel="rollbackTextSetting"
            />
            <InputColorToolButton
              v-model:color="textSetting.stroke"
              icon="/commons/icons/pen.svg"
              label="テキストの枠線色"
              @open="backupTextSetting"
              @cancel="rollbackTextSetting"
            />
            <ToolInputNumber
              v-model="textSetting.strokeWidth"
              :min="0"
              :max="100"
              mode="uint"
              icon="/commons/icons/line_weight.svg"
              label="テキストの枠線太さ"
            />
          </template>
        </template>
      </div>
    </div>
    <div class="c-container__editer" @drop.prevent="onDropFile">
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
  <Teleport to="body">
    <div v-show="exportFile.isShowModal" class="c-export__background"></div>
    <BasicDialog
      v-model:isShowModal="exportFile.isShowModal"
      class="u-absolute--center"
      @submit="onExport"
    >
      <div class="c-export__modal__name">
        <InputText
          v-model:text="exportFile.name"
          placeholder="出力するファイルの名前"
        />
      </div>
      <div class="c-export__modal__extension">
        <template v-for="extension in extensionList">
          <label>
            <input
              v-model="exportFile.extension"
              type="radio"
              :value="extension"
            />
            {{ extension }}
          </label>
        </template>
      </div>
    </BasicDialog>
  </Teleport>
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
    min-height: 2rem;
    &__menu {
      display: flex;
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
      &__text {
        width: 16rem;
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
.c-export {
  &__background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: black;
    opacity: 0.5;
  }
  &__modal {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    top: 0;
    &__extension {
      margin-top: 0.4rem;
      display: flex;
      justify-content: flex-start;
      gap: 0.8rem;
      label {
        cursor: pointer;
      }
    }
  }
}
.u-mouse_icon--pen,
.u-mouse_icon--default {
  :deep(canvas.upper-canvas) {
    cursor: inherit !important;
  }
}
</style>
