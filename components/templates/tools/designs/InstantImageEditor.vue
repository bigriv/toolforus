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
import InputColorToolButton from "@/components/organisms/interfaces/InputColorToolButton.vue";
import draggable from "vuedraggable";
import { useShortcutKey } from "@/composables/common/shortcut";
import { useIieCanvas } from "@/composables/tools/designs/iie/canvas";
import { useIieFile } from "@/composables/tools/designs/iie/file";
import { useIieFilter } from "@/composables/tools/designs/iie/filter";
import { useIiePen } from "@/composables/tools/designs/iie/pen";
import { useIieShape } from "@/composables/tools/designs/iie/shape";
import { useIieCrop } from "@/composables/tools/designs/iie/crop";
import { useIieText } from "@/composables/tools/designs/iie/text";
import { useIieHistory } from "@/composables/tools/designs/iie/history";
import { useIieTransform } from "@/composables/tools/designs/iie/transform";
import { useIieLayer } from "@/composables/tools/designs/iie/layer";
import { useIieBackgroundRemoval } from "@/composables/tools/designs/iie/backgroundRemoval";

const canvasRef = ref<HTMLCanvasElement>();
const mouse = ref({
  isDown: false,
  drag: { start: { x: 0, y: 0 }, end: { x: 0, y: 0 } },
});

const {
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
  shapeList,
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
const { transform, reflectTransform, flipHorizontal, flipVertical } =
  useIieTransform(canvas);
const { removeBackground, isProcessing, errorMessage } =
  useIieBackgroundRemoval(canvas);
const {
  layers,
  refreshLayers,
  syncCanvasOrder,
  getLayerType,
  getLayerLabel,
  getLayerIcon,
  selectLayer,
  removeLayer,
  toggleVisibility,
  toggleLock,
} = useIieLayer(canvas);

const isMergingPath = ref(false);

// vuedraggable 用: v-model として layers を読み書きする computed
const sortableLayers = computed({
  get: () => layers.value,
  set: (val: fabric.Object[]) => {
    layers.value = val;
  },
});

const onLayerSorted = () => {
  syncCanvasOrder();
  save();
};

const selectedObjects = ref<fabric.Object[]>([]);

const isSelectingSingle = computed(() => selectedObjects.value.length === 1);
const isSelectingImage = computed(
  () =>
    isSelectingSingle.value &&
    selectedObjects.value[0] instanceof fabric.Image
);
const isSelectingShape = computed(
  () => isSelectingSingle.value && isShape(selectedObjects.value[0])
);
const isSelectingText = computed(
  () =>
    isSelectingSingle.value &&
    selectedObjects.value[0] instanceof fabric.Text
);

const onHistoryRestore = () => {
  refreshLayers();
  selectedObjects.value = [];
  if (canvas.value) {
    canvas.value.isDrawingMode = currentTool.value === "pen";
  }
};

const { save, undo, redo, canUndo, canRedo } = useIieHistory(
  canvas,
  onHistoryRestore
);

const { addShortcutKey, removeShortcutKey } = useShortcutKey([
  {
    code: "Delete",
    onKeydown: () => onDeleteObjects(),
  },
  {
    code: "Escape",
    onKeydown: () => {
      canvas.value?.discardActiveObject();
      canvas.value?.renderAll();
    },
  },
]);

// --- Canvas event handlers ---

const onMouseDown = (options: fabric.IEvent) => {
  if (!options.pointer || options.target) return;
  mouse.value.drag.start.x = options.pointer.x;
  mouse.value.drag.start.y = options.pointer.y;
  mouse.value.isDown = true;
};

const onMouseMove = (options: fabric.IEvent) => {
  if (!options.pointer) return;
  mouse.value.drag.end.x = options.pointer.x;
  mouse.value.drag.end.y = options.pointer.y;
};

const onMouseUp = (options: fabric.IEvent) => {
  if (!mouse.value.isDown || !options.pointer) return;
  mouse.value.isDown = false;
  if (currentTool.value === "shape") {
    const shape = generateShape(mouse.value.drag.start, mouse.value.drag.end);
    if (shape) canvas.value?.add(shape);
  } else if (currentTool.value === "text") {
    if (mouse.value.drag.end.x - mouse.value.drag.start.x <= 0) return;
    if (mouse.value.drag.end.y - mouse.value.drag.start.y <= 0) return;
    canvas.value?.add(generateTextObject(mouse.value.drag.start));
  }
};

const onUpdateSelectingObjects = () => {
  if (!canvas.value) return;
  selectedObjects.value = canvas.value.getActiveObjects();
  if (currentTool.value === "cursor") {
    reflectFilter();
    reflectShapeSetting();
    reflectTextSetting();
    if (isSelectingSingle.value) reflectTransform();
  }
};

// --- Actions ---

const onDeleteObjects = () => {
  if (!canvas.value) return;
  canvas.value.getActiveObjects().forEach((o) => canvas.value?.remove(o));
  canvas.value.discardActiveObject();
};

const handleCropSubmit = () => {
  onCropSubmit();
  save();
  refreshLayers();
};

const handleToolChange = () => {
  onChangeTool();
  selectedObjects.value = [];
  canvas.value?.discardActiveObject();
  canvas.value?.renderAll();
};

// --- Lifecycle ---

onMounted(() => {
  initCanvas();
  if (!canvas.value) return;

  canvas.value.on("mouse:down", onMouseDown);
  canvas.value.on("mouse:move", onMouseMove);
  canvas.value.on("mouse:up", onMouseUp);
  canvas.value.on("selection:created", onUpdateSelectingObjects);
  canvas.value.on("selection:updated", onUpdateSelectingObjects);
  canvas.value.on("selection:cleared", () => {
    selectedObjects.value = [];
  });
  canvas.value.on("object:added", (e: fabric.IEvent) => {
    if ((e.target as any)?.name === "crop_frame") return;
    if (isReordering.value || isMergingPath.value) return;
    refreshLayers();
    // ペンのパスは path:created で保存するためここでは保存しない
    if (!(e.target instanceof fabric.Path && canvas.value?.isDrawingMode)) {
      save();
    }
  });
  canvas.value.on("object:removed", (e: fabric.IEvent) => {
    if ((e.target as any)?.name === "crop_frame") return;
    if (isReordering.value || isMergingPath.value) return;
    refreshLayers();
    save();
  });
  canvas.value.on("object:modified", () => {
    if (isReordering.value || isMergingPath.value) return;
    save();
    if (isSelectingSingle.value) reflectTransform();
  });
  canvas.value.on("path:created", (e: any) => {
    const newPath = e.path as fabric.Path;

    const isPenLayer = (obj: fabric.Object) =>
      obj instanceof fabric.Path ||
      (obj instanceof fabric.Group &&
        (obj as fabric.Group)
          .getObjects()
          .every((i) => i instanceof fabric.Path));

    // 選択中のペンレイヤーを優先、なければ既存のペンレイヤーを探す
    const selected = selectedObjects.value[0];
    const target =
      selectedObjects.value.length === 1 && isPenLayer(selected)
        ? selected
        : canvas.value
            ?.getObjects()
            .find((obj) => obj !== newPath && isPenLayer(obj));

    if (target) {
      isMergingPath.value = true;
      try {
        if (target instanceof fabric.Group) {
          canvas.value?.remove(newPath);
          (target as fabric.Group).addWithUpdate(newPath);
          canvas.value?.setActiveObject(target);
        } else {
          canvas.value?.remove(newPath);
          canvas.value?.remove(target);
          const group = new fabric.Group([target, newPath]);
          canvas.value?.add(group);
          canvas.value?.setActiveObject(group);
        }
        canvas.value?.renderAll();
        refreshLayers();
        selectedObjects.value = canvas.value?.getActiveObjects() ?? [];
      } finally {
        isMergingPath.value = false;
      }
    }
    save();
  });

  save(); // 初期状態を履歴に保存
  addShortcutKey();
});

onUnmounted(() => {
  removeShortcutKey();
  canvas.value?.dispose();
});
</script>

<template>
  <div class="c-editor">
    <!-- ===== Top bar ===== -->
    <div class="c-editor__topbar">
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
      <div class="c-editor__topbar__sep" />
      <ToolButton
        icon="/commons/icons/undo.svg"
        label="元に戻す"
        :disabled="!canUndo"
        @click="undo"
      />
      <ToolButton
        icon="/commons/icons/redo.svg"
        label="やり直す"
        :disabled="!canRedo"
        @click="redo"
      />
      <div class="c-editor__topbar__sep" />
      <ToolRadioButtons
        v-model:selected="currentCanvasRatio"
        name="canvas_ratio"
        label="比率"
        :list="canvasRatioList"
        @change="onChangeCanvasRatio"
      />
      <template v-if="currentCanvasRatio === 'custom'">
        <div class="c-editor__topbar__size">
          <span>W</span>
          <InputNumber
            v-model="size.width"
            :min="1"
            :max="4000"
            mode="uint"
            @update:modelValue="onChangeCanvasSize"
          />
        </div>
        <div class="c-editor__topbar__size">
          <span>H</span>
          <InputNumber
            v-model="size.height"
            :min="1"
            :max="4000"
            mode="uint"
            @update:modelValue="onChangeCanvasSize"
          />
        </div>
      </template>
    </div>

    <!-- ===== Tool bar ===== -->
    <div class="c-editor__toolbar">
      <ToolRadioButtons
        v-model:selected="currentTool"
        name="tool"
        :list="toolList"
        @change="handleToolChange"
      />
      <template v-if="currentTool === 'shape'">
        <ToolRadioButtons
          v-model:selected="currentShape"
          name="shape"
          label="図形"
          :list="shapeList"
        />
      </template>
    </div>

    <!-- ===== Main area ===== -->
    <div class="c-editor__main">
      <!-- Left: Layer panel -->
      <div class="c-editor__main__layers">
        <div class="c-editor__main__layers__header">レイヤー</div>
        <draggable
          v-model="sortableLayers"
          item-key="__tou_id"
          ghost-class="c-editor__main__layers__item--ghost"
          chosen-class="c-editor__main__layers__item--chosen"
          animation="150"
          @end="onLayerSorted"
        >
          <template #item="{ element: obj }">
            <div
              class="c-editor__main__layers__item"
              :class="{
                'c-editor__main__layers__item--selected':
                  selectedObjects.includes(obj),
                'c-editor__main__layers__item--hidden': !obj.visible,
              }"
              @click="selectLayer(obj)"
            >
              <div class="c-editor__main__layers__item__main">
                <img
                  class="c-editor__main__layers__item__type"
                  :src="getLayerIcon(getLayerType(obj))"
                  :alt="getLayerType(obj)"
                  draggable="false"
                />
                <span class="c-editor__main__layers__item__label">
                  {{ getLayerLabel(obj) }}
                </span>
                <button
                  class="c-layer-btn"
                  :title="obj.visible ? '非表示にする' : '表示する'"
                  @click.stop="toggleVisibility(obj)"
                >
                  <img
                    :src="
                      obj.visible
                        ? '/commons/icons/visibility.svg'
                        : '/commons/icons/visibility_off.svg'
                    "
                  />
                </button>
                <button
                  class="c-layer-btn"
                  :title="obj.selectable ? 'ロックする' : 'ロック解除'"
                  @click.stop="toggleLock(obj)"
                >
                  <img
                    :src="
                      obj.selectable
                        ? '/commons/icons/lock_open.svg'
                        : '/commons/icons/lock.svg'
                    "
                  />
                </button>
                <button
                  class="c-layer-btn c-layer-btn--delete"
                  title="削除"
                  @click.stop="removeLayer(obj)"
                >
                  <img src="/commons/icons/delete.svg" />
                </button>
              </div>
            </div>
          </template>
        </draggable>
      </div>

      <!-- Center: Canvas -->
      <div
        class="c-editor__main__canvas"
        @drop.prevent="onDropFile"
        @dragover.prevent
      >
        <div v-if="cropping.target" class="c-editor__main__canvas__crop_bar">
          <ToolButton
            icon="/commons/icons/flag.svg"
            label="適用"
            @click="handleCropSubmit"
          />
          <ToolButton
            icon="/commons/icons/close.svg"
            label="キャンセル"
            @click="onCropCancel"
          />
        </div>
        <div
          class="c-editor__main__canvas__inner"
          :class="{ 'u-cursor--pen': currentTool === 'pen' }"
        >
          <canvas ref="canvasRef"></canvas>
        </div>
      </div>

      <!-- Right: Properties panel -->
      <div class="c-editor__main__props">
        <!-- ペンツール設定 -->
        <template v-if="currentTool === 'pen' && !cropping.target">
          <div class="c-props__section">
            <div class="c-props__section__title">ペン設定</div>
            <div class="c-props__section__row">
              <span class="c-props__section__row__label">色</span>
              <InputColorToolButton
                v-model:color="penSetting.color"
                icon="/commons/icons/pen.svg"
                label="ペンの色"
              />
            </div>
            <div class="c-props__section__row">
              <span class="c-props__section__row__label">太さ</span>
              <div class="c-props__section__row__input">
                <InputNumber
                  v-model="penSetting.size"
                  :min="1"
                  :max="100"
                  mode="uint"
                />
              </div>
            </div>
          </div>
        </template>

        <!-- カーソルツール + オブジェクト選択時 -->
        <template
          v-if="
            currentTool === 'cursor' &&
            selectedObjects.length > 0 &&
            !cropping.target
          "
        >
          <!-- 変形 (単一選択時のみ) -->
          <template v-if="isSelectingSingle">
            <div class="c-props__section">
              <div class="c-props__section__title">変形</div>
              <div class="c-props__section__row2">
                <div class="c-props__section__row2__cell">
                  <span class="c-props__section__row__label">X</span>
                  <div class="c-props__section__row__input">
                    <InputNumber
                      v-model="transform.x"
                      :min="-4000"
                      :max="4000"
                      mode="int"
                    />
                  </div>
                </div>
                <div class="c-props__section__row2__cell">
                  <span class="c-props__section__row__label">Y</span>
                  <div class="c-props__section__row__input">
                    <InputNumber
                      v-model="transform.y"
                      :min="-4000"
                      :max="4000"
                      mode="int"
                    />
                  </div>
                </div>
              </div>
              <div class="c-props__section__row2">
                <div class="c-props__section__row2__cell">
                  <span class="c-props__section__row__label">W</span>
                  <div class="c-props__section__row__input">
                    <InputNumber
                      v-model="transform.width"
                      :min="1"
                      :max="4000"
                      mode="uint"
                    />
                  </div>
                </div>
                <div class="c-props__section__row2__cell">
                  <span class="c-props__section__row__label">H</span>
                  <div class="c-props__section__row__input">
                    <InputNumber
                      v-model="transform.height"
                      :min="1"
                      :max="4000"
                      mode="uint"
                    />
                  </div>
                </div>
              </div>
              <div class="c-props__section__row">
                <span class="c-props__section__row__label">角度</span>
                <div class="c-props__section__row__input">
                  <InputSlideAndNumber
                    v-model="transform.angle"
                    :min="-180"
                    :max="180"
                  />
                </div>
              </div>
              <div class="c-props__section__row">
                <ToolButton
                  icon="/commons/icons/flip_horizontal.svg"
                  label="水平反転"
                  @click="flipHorizontal"
                />
                <ToolButton
                  icon="/commons/icons/flip_vertical.svg"
                  label="垂直反転"
                  @click="flipVertical"
                />
              </div>
            </div>
          </template>

          <!-- 画像フィルター -->
          <template v-if="isSelectingImage">
            <div class="c-props__section">
              <div class="c-props__section__title">フィルター</div>
              <div class="c-props__section__row">
                <span class="c-props__section__row__label">コントラスト</span>
                <div class="c-props__section__row__input">
                  <InputSlideAndNumber
                    v-model="filter.contrast"
                    :min="-100"
                    :max="100"
                  />
                </div>
              </div>
              <div class="c-props__section__row">
                <span class="c-props__section__row__label">明度</span>
                <div class="c-props__section__row__input">
                  <InputSlideAndNumber
                    v-model="filter.brightness"
                    :min="-100"
                    :max="100"
                  />
                </div>
              </div>
              <div class="c-props__section__row">
                <span class="c-props__section__row__label">彩度</span>
                <div class="c-props__section__row__input">
                  <InputSlideAndNumber
                    v-model="filter.saturation"
                    :min="-100"
                    :max="100"
                  />
                </div>
              </div>
              <div class="c-props__section__row">
                <span class="c-props__section__row__label">色相</span>
                <div class="c-props__section__row__input">
                  <InputSlideAndNumber
                    v-model="filter.hueRotation"
                    :min="-100"
                    :max="100"
                  />
                </div>
              </div>
              <div class="c-props__section__row">
                <span class="c-props__section__row__label">ぼかし</span>
                <div class="c-props__section__row__input">
                  <InputSlideAndNumber
                    v-model="filter.blur"
                    :min="0"
                    :max="100"
                  />
                </div>
              </div>
              <div class="c-props__section__row">
                <span class="c-props__section__row__label">透明度</span>
                <div class="c-props__section__row__input">
                  <InputSlideAndNumber
                    v-model="filter.opacity"
                    :min="0"
                    :max="100"
                  />
                </div>
              </div>
              <div class="c-props__section__row">
                <ToolButton
                  icon="/commons/icons/crop.svg"
                  label="トリミング"
                  @click="onCropStart"
                />
              </div>
              <div class="c-props__section__row">
                <ToolButton
                  icon="/commons/icons/eraser.svg"
                  label="背景透過 (remove.bg)"
                  :disabled="isProcessing"
                  @click="removeBackground"
                />
                <span v-if="isProcessing" class="c-props__processing">処理中…</span>
              </div>
              <div v-if="errorMessage" class="c-props__error">
                {{ errorMessage }}
              </div>
            </div>
          </template>

          <!-- 図形設定 -->
          <template v-if="isSelectingShape">
            <div class="c-props__section">
              <div class="c-props__section__title">図形</div>
              <div class="c-props__section__row">
                <span class="c-props__section__row__label">塗り</span>
                <InputColorToolButton
                  v-model:color="shapeSetting.fill"
                  icon="/commons/icons/colors.svg"
                  label="図形の塗りつぶし色"
                  @open="backupShapeSetting"
                  @cancel="rollbackShapeSetting"
                />
              </div>
              <div class="c-props__section__row">
                <span class="c-props__section__row__label">枠線色</span>
                <InputColorToolButton
                  v-model:color="shapeSetting.border"
                  icon="/commons/icons/pen.svg"
                  label="図形の枠線色"
                  @open="backupShapeSetting"
                  @cancel="rollbackShapeSetting"
                />
              </div>
              <div class="c-props__section__row">
                <span class="c-props__section__row__label">枠線太さ</span>
                <div class="c-props__section__row__input">
                  <InputNumber
                    v-model="shapeSetting.borderWidth"
                    :min="0"
                    :max="100"
                    mode="uint"
                  />
                </div>
              </div>
            </div>
          </template>

          <!-- テキスト設定 -->
          <template v-if="isSelectingText">
            <div class="c-props__section">
              <div class="c-props__section__title">テキスト</div>
              <div class="c-props__section__row">
                <div class="c-props__section__row__input--full">
                  <ToolInputText
                    v-model="textSetting.text"
                    placeholder="テキスト"
                    :maxlength="100"
                    icon="/commons/icons/title.svg"
                    label="テキスト"
                    @update:modelValue="onChangeText"
                  />
                </div>
              </div>
              <div class="c-props__section__row">
                <span class="c-props__section__row__label">サイズ</span>
                <div class="c-props__section__row__input">
                  <InputNumber
                    v-model="textSetting.size"
                    :min="6"
                    :max="200"
                    mode="uint"
                  />
                </div>
              </div>
              <div class="c-props__section__row">
                <span class="c-props__section__row__label">文字色</span>
                <InputColorToolButton
                  v-model:color="textSetting.color"
                  icon="/commons/icons/colors.svg"
                  label="テキストの塗りつぶし色"
                  @open="backupTextSetting"
                  @cancel="rollbackTextSetting"
                />
              </div>
              <div class="c-props__section__row">
                <span class="c-props__section__row__label">枠線色</span>
                <InputColorToolButton
                  v-model:color="textSetting.stroke"
                  icon="/commons/icons/pen.svg"
                  label="テキストの枠線色"
                  @open="backupTextSetting"
                  @cancel="rollbackTextSetting"
                />
              </div>
              <div class="c-props__section__row">
                <span class="c-props__section__row__label">枠線太さ</span>
                <div class="c-props__section__row__input">
                  <InputNumber
                    v-model="textSetting.strokeWidth"
                    :min="0"
                    :max="100"
                    mode="uint"
                  />
                </div>
              </div>
            </div>
          </template>

          <!-- 削除ボタン -->
          <div class="c-props__section c-props__section--actions">
            <ToolButton
              icon="/commons/icons/delete.svg"
              label="削除"
              color="red"
              @click="onDeleteObjects"
            />
          </div>
        </template>
      </div>
    </div>
  </div>

  <!-- Export modal -->
  <Teleport to="body">
    <div v-show="exportFile.isShowModal" class="c-export__overlay" />
    <BasicDialog
      v-model:isShowModal="exportFile.isShowModal"
      class="u-absolute--center"
      @submit="onExport"
    >
      <div class="c-export__name">
        <InputText v-model:text="exportFile.name" placeholder="ファイル名" />
      </div>
      <div class="c-export__ext">
        <template v-for="ext in extensionList" :key="ext">
          <label>
            <input v-model="exportFile.extension" type="radio" :value="ext" />
            {{ ext }}
          </label>
        </template>
      </div>
    </BasicDialog>
  </Teleport>
</template>

<style scoped lang="scss">
.c-editor {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  &__topbar,
  &__toolbar {
    display: flex;
    align-items: center;
    background: white;
    border-bottom: 0.1rem solid black;
    min-height: 2rem;
    flex-shrink: 0;
    gap: 0.2rem;
    padding: 0.1rem 0.2rem;
    flex-wrap: wrap;
  }

  &__topbar {
    &__sep {
      width: 0.1rem;
      height: 1.6rem;
      background: #ccc;
      margin: 0 0.2rem;
    }

    &__size {
      display: flex;
      align-items: center;
      gap: 0.2rem;
      border: 0.1rem solid black;
      padding: 0 0.4rem;
      height: 2rem;

      span {
        font-size: 0.75rem;
      }

      input {
        width: 4rem;
      }
    }
  }

  &__main {
    display: flex;
    flex: 1;
    overflow: hidden;

    &__layers {
      width: 11rem;
      border-right: 0.1rem solid black;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      flex-shrink: 0;
      background: white;

      &__header {
        padding: 0.3rem 0.5rem;
        font-size: 0.75rem;
        font-weight: bold;
        background: #f0f0f0;
        border-bottom: 0.1rem solid #ddd;
        flex-shrink: 0;
      }

      &__item {
        display: flex;
        flex-direction: column;
        border-bottom: 0.05rem solid #eee;
        cursor: grab;
        font-size: 0.7rem;

        &:hover {
          background: #f5f5f5;

          .c-layer-btn--delete {
            display: flex;
          }
        }

        &--selected {
          background: #e8e8ff;

          &:hover {
            background: #ddddf8;
          }
        }

        &--hidden {
          opacity: 0.5;
        }

        &--ghost {
          opacity: 0.35;
          background: #e8e8ff;
        }

        &--chosen {
          background: #ddddf8;
        }

        &__main {
          display: flex;
          align-items: center;
          padding: 0.3rem 0.4rem;
          gap: 0.3rem;
          min-height: 2.2rem;

          .c-layer-btn--delete {
            display: none;
          }
        }

        &__type {
          flex-shrink: 0;
          width: 1rem;
          height: 1rem;
        }

        &__label {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          min-width: 0;
        }
      }
    }

    &__canvas {
      flex: 1;
      overflow: auto;
      background: #ddd;
      display: flex;
      flex-direction: column;
      align-items: center;

      &__crop_bar {
        display: flex;
        gap: 0.2rem;
        padding: 0.2rem;
        background: white;
        border-bottom: 0.1rem solid black;
        align-self: stretch;
        flex-shrink: 0;
      }

      &__inner {
        margin: 1rem auto;
        border: 0.1rem solid #999;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        background: white;

        canvas {
          display: block;
        }
      }
    }

    &__props {
      width: 14rem;
      border-left: 0.1rem solid black;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      flex-shrink: 0;
      background: white;

      // カラーピッカーを左側に開く
      :deep(.c-input_color_tool_button__modal) {
        left: auto;
        right: 2.4rem;
      }

      // ToolInputText のラベルを左側に開く
      :deep(.c-tool_input_text__label) {
        left: auto;
        right: calc(100% + 0.5rem);
      }
    }
  }
}

// レイヤーパネルのボタン
.c-layer-btn {
  width: 1.8rem;
  height: 1.8rem;
  padding: 0;
  border: 0.05rem solid #ccc;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 0.2rem;

  img {
    width: 1.1rem;
    height: 1.1rem;
  }

  &:hover {
    background: #e0e0e0;
  }

  &--delete:hover {
    background: #ffeeee;

    img {
      filter: invert(15%) sepia(95%) saturate(6932%) hue-rotate(358deg)
        brightness(95%) contrast(112%);
    }
  }
}

// プロパティパネルのセクション
.c-props {
  &__section {
    border-bottom: 0.1rem solid #eee;
    padding: 0.5rem;

    &__title {
      font-size: 0.7rem;
      font-weight: bold;
      color: #555;
      margin-bottom: 0.4rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    &__row {
      display: flex;
      align-items: center;
      margin-bottom: 0.35rem;
      gap: 0.3rem;
      min-height: 1.6rem;

      &__label {
        font-size: 0.68rem;
        width: 3.2rem;
        flex-shrink: 0;
        color: #444;
        white-space: nowrap;
      }

      &__input {
        flex: 1;
        min-width: 0;
      }

      &__input--full {
        width: 100%;
        min-width: 0;
      }
    }

    &__row2 {
      display: flex;
      gap: 0.3rem;
      margin-bottom: 0.35rem;

      &__cell {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 0.2rem;
        min-width: 0;

        .c-props__section__row__label {
          width: 0.8rem;
        }

        .c-props__section__row__input {
          flex: 1;
          min-width: 0;
        }
      }
    }

    &--actions {
      display: flex;
      gap: 0.3rem;
      flex-wrap: wrap;
      padding: 0.5rem;
    }
  }
}

.c-props__processing {
  font-size: 0.68rem;
  color: #666;
}

.c-props__error {
  margin: 0.3rem 0.5rem;
  padding: 0.3rem 0.4rem;
  background: #fff0f0;
  border: 0.05rem solid #ffaaaa;
  border-radius: 0.2rem;
  font-size: 0.65rem;
  color: #c00;
  line-height: 1.4;
}

.u-cursor--pen {
  :deep(canvas.upper-canvas) {
    cursor: crosshair !important;
  }
}

.c-export {
  &__overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: black;
    opacity: 0.5;
    z-index: 10;
  }

  &__name {
    margin-bottom: 0.5rem;
  }

  &__ext {
    display: flex;
    gap: 0.8rem;

    label {
      cursor: pointer;
    }
  }
}
</style>
