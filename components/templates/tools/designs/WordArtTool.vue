<script setup lang="ts">
import { fabric } from "fabric";
import BasicDialog from "@/components/atoms/BasicDialog.vue";
import InputText from "@/components/atoms/interfaces/InputText.vue";
import ToolRadioButtons from "@/components/atoms/interfaces/ToolRadioButtons.vue";
import EditorTopbar from "@/components/organisms/interfaces/EditorTopbar.vue";
import LayerPanel from "@/components/organisms/canvas/LayerPanel.vue";
import PropertiesPanel from "@/components/organisms/canvas/PropertiesPanel.vue";
import WorkspaceLayout from "@/components/organisms/canvas/WorkspaceLayout.vue";
import type { LayerItem } from "@/components/organisms/canvas/LayerPanel.vue";
import { useShortcutKey } from "@/composables/common/shortcut";
import { useEditorFile } from "@/composables/tools/designs/canvas/file";
import { useCanvasBase } from "@/composables/tools/designs/canvas/canvasBase";
import { useEditorZoom } from "@/composables/tools/designs/canvas/zoom";
import { useText } from "@/composables/tools/designs/wordArt/text";

const canvasRef = ref<HTMLCanvasElement>();
const mouse = ref({
  isDown: false,
  drag: { start: { x: 0, y: 0 }, end: { x: 0, y: 0 } },
});

const ICON_PATH = "/commons/icons/";
const toolList = [
  { value: "cursor", icon: `${ICON_PATH}cursor.svg`, label: "選択" },
  { value: "text", icon: `${ICON_PATH}title.svg`, label: "テキスト" },
  { value: "zoom", icon: `${ICON_PATH}zoom_in.svg`, label: "ズーム" },
];

const {
  canvas,
  currentTool,
  canvasRatioList,
  size,
  currentCanvasRatio,
  initCanvas,
  onChangeCanvasRatio,
  onChangeTool,
  onChangeCanvasSize,
  selectedObjects,
  isSelectingSingle,
  setupEvents,
  save,
  undo,
  redo,
  canUndo,
  canRedo,
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
  renameLayer,
  addLayer,
  transform,
  flipHorizontal,
  flipVertical,
} = useCanvasBase(canvasRef, {
  onSelectionUpdate: (objects) => {
    if (currentTool.value === "cursor" && objects.length > 0)
      reflectTextSetting();
  },
});

const { extensionList, exportFile, onOpenExportModal, onExport, onDropFile } =
  useEditorFile(canvas);
const {
  textSetting,
  reflectTextSetting,
  generateTextObject,
  backupTextSetting,
  rollbackTextSetting,
  onChangeText,
} = useText(canvas);
const { zoom, setupZoom, setupZoomTool } = useEditorZoom(canvas);

const isSelectingText = computed(
  () =>
    isSelectingSingle.value && selectedObjects.value[0] instanceof fabric.Text,
);

const isCursorSelecting = computed(
  () => currentTool.value === "cursor" && selectedObjects.value.length > 0,
);

const layerItems = computed<LayerItem[]>(() =>
  layers.value.map((obj) => ({
    id: (obj as any).layerId as string,
    label: getLayerLabel(obj),
    typeIcon: getLayerIcon(getLayerType(obj)),
    visible: !!obj.visible,
    locked: !obj.selectable,
  })),
);
const selectedIds = computed(() =>
  selectedObjects.value.map((obj) => (obj as any).layerId as string),
);
const findObjById = (id: string) =>
  layers.value.find((obj) => (obj as any).layerId === id);

const onLayerRenamed = (id: string, newName: string) => {
  const o = findObjById(id);
  if (o) {
    renameLayer(o, newName);
    refreshLayers();
  }
};

const onLayerAdded = () => {
  addLayer("text");
  save();
};

const onLayerSorted = (newItems: LayerItem[]) => {
  const current = [...layers.value];
  layers.value = newItems
    .map((item) => current.find((obj) => (obj as any).layerId === item.id))
    .filter(Boolean) as fabric.Object[];
  syncCanvasOrder();
  save();
};

const onMouseDown = (options: fabric.IEvent) => {
  if (currentTool.value === "zoom") return;
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
  if (currentTool.value === "text") {
    if (mouse.value.drag.end.x - mouse.value.drag.start.x <= 0) return;
    if (mouse.value.drag.end.y - mouse.value.drag.start.y <= 0) return;
    canvas.value?.add(generateTextObject(mouse.value.drag.start));
  }
};

const onDeleteObjects = () => {
  if (!canvas.value) return;
  canvas.value.getActiveObjects().forEach((o) => canvas.value?.remove(o));
  canvas.value.discardActiveObject();
};

const handleToolChange = () => {
  onChangeTool();
  if (canvas.value) canvas.value.selection = currentTool.value !== "zoom";
  selectedObjects.value = [];
  canvas.value?.discardActiveObject();
  canvas.value?.renderAll();
};

const onContextMenu = (e: MouseEvent) => {
  if (currentTool.value === "zoom") e.preventDefault();
};

const { addShortcutKey, removeShortcutKey } = useShortcutKey([
  { code: "Delete", onKeydown: () => onDeleteObjects() },
  {
    code: "Escape",
    onKeydown: () => {
      canvas.value?.discardActiveObject();
      canvas.value?.renderAll();
    },
  },
]);

onMounted(() => {
  initCanvas();
  if (!canvas.value) return;
  canvas.value.on("mouse:down", onMouseDown);
  canvas.value.on("mouse:move", onMouseMove);
  canvas.value.on("mouse:up", onMouseUp);
  setupEvents();
  setupZoom();
  setupZoomTool(() => currentTool.value);
  save();
  addShortcutKey();
});

onUnmounted(() => {
  removeShortcutKey();
  canvas.value?.dispose();
});
</script>

<template>
  <div class="c-editor">
    <EditorTopbar
      :ratio-list="canvasRatioList"
      :current-ratio="currentCanvasRatio"
      :canvas-width="size.width"
      :canvas-height="size.height"
      :can-undo="canUndo"
      :can-redo="canRedo"
      @export-open="onOpenExportModal"
      @undo="undo"
      @redo="redo"
      @change-ratio="
        (r: string) => {
          currentCanvasRatio = r;
          onChangeCanvasRatio();
        }
      "
      @change-size="onChangeCanvasSize"
    />
    <div class="c-editor__toolbar">
      <ToolRadioButtons
        v-model:selected="currentTool"
        name="tool"
        :list="toolList"
        @change="handleToolChange"
      />
    </div>
    <WorkspaceLayout
      storage-key="tou.word-art-layout"
      :titles="{
        layer: 'レイヤー',
        canvas: 'キャンバス',
        properties: 'プロパティ',
      }"
      class="c-editor__workspace"
    >
      <template #layer>
        <LayerPanel
          :layers="layerItems"
          :selected-ids="selectedIds"
          @sorted="onLayerSorted"
          @select="
            (id: string) => {
              const o = findObjById(id);
              if (o) selectLayer(o);
            }
          "
          @remove="
            (id: string) => {
              const o = findObjById(id);
              if (o) removeLayer(o);
            }
          "
          @toggle-visibility="
            (id: string) => {
              const o = findObjById(id);
              if (o) toggleVisibility(o);
            }
          "
          @toggle-lock="
            (id: string) => {
              const o = findObjById(id);
              if (o) toggleLock(o);
            }
          "
          @rename="onLayerRenamed"
          @add="onLayerAdded"
        />
      </template>
      <template #canvas>
        <div
          class="c-canvas-area"
          :class="{
            'u-cursor--text': currentTool === 'text',
            'u-cursor--zoom': currentTool === 'zoom',
          }"
          :style="{ '--canvas-zoom': zoom }"
          @contextmenu="onContextMenu"
          @drop.prevent="onDropFile"
          @dragover.prevent
        >
          <div class="c-canvas-area__inner">
            <canvas ref="canvasRef"></canvas>
          </div>
        </div>
      </template>
      <template #properties>
        <PropertiesPanel
          :show-transform="isCursorSelecting"
          :show-text="isCursorSelecting && isSelectingText"
          :show-actions="isCursorSelecting"
          :transform-x="transform.x"
          :transform-y="transform.y"
          :transform-width="transform.width"
          :transform-height="transform.height"
          :transform-angle="transform.angle"
          :text-content="textSetting.text"
          :text-size="textSetting.size"
          :text-color="textSetting.color"
          :text-stroke="textSetting.stroke"
          :text-stroke-width="textSetting.strokeWidth"
          @update:transform-x="transform.x = $event"
          @update:transform-y="transform.y = $event"
          @update:transform-width="transform.width = $event"
          @update:transform-height="transform.height = $event"
          @update:transform-angle="transform.angle = $event"
          @flip-horizontal="flipHorizontal"
          @flip-vertical="flipVertical"
          @update:text-content="textSetting.text = $event"
          @update:text-size="textSetting.size = $event"
          @update:text-color="textSetting.color = $event"
          @update:text-stroke="textSetting.stroke = $event"
          @update:text-stroke-width="textSetting.strokeWidth = $event"
          @change-text="onChangeText"
          @text-color-open="backupTextSetting"
          @text-color-cancel="rollbackTextSetting"
          @delete="onDeleteObjects"
        />
      </template>
    </WorkspaceLayout>
  </div>

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

  &__workspace {
    flex: 1;
    min-height: 0;
  }
}

.c-canvas-area {
  width: 100%;
  height: 100%;
  overflow: auto;
  background: #ddd;
  display: flex;
  flex-direction: column;
  align-items: center;

  &__inner {
    margin: 1rem auto;
    border: 0.1rem solid #999;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    background: white;
    zoom: var(--canvas-zoom, 1);

    canvas {
      display: block;
    }
  }
}

.u-cursor--text {
  :deep(canvas.upper-canvas) {
    cursor: crosshair !important;
  }
}
.u-cursor--zoom {
  :deep(canvas.upper-canvas) {
    cursor: zoom-in !important;
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
