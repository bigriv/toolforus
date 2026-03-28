import { fabric } from "fabric";
import { useEditorCanvas } from "@/composables/tools/designs/canvas/canvas";
import { useEditorHistory } from "@/composables/tools/designs/canvas/history";
import { useEditorLayer } from "@/composables/tools/designs/canvas/layer";
import { useEditorTransform } from "@/composables/tools/designs/canvas/transform";

interface CanvasBaseOptions {
  onSelectionUpdate?: (objects: fabric.Object[]) => void; // ツール固有の reflect 処理（reflectShapeSetting 等）
}

export const useCanvasBase = (
  canvasRef: Ref<HTMLCanvasElement | undefined>,
  options: CanvasBaseOptions = {}
) => {
  const {
    canvas, currentTool,
    toolList, canvasRatioList, size, currentCanvasRatio,
    initCanvas, onChangeCanvasRatio, onChangeTool, onChangeCanvasSize,
  } = useEditorCanvas(canvasRef);
  const selectedObjects = ref<fabric.Object[]>([]);
  const isMergingPath = ref(false); // パス統合処理中フラグ（object:added / removed の二重発火を防ぐ）

  const {
    layers, refreshLayers, syncCanvasOrder,
    getLayerType, getLayerLabel, getLayerIcon,
    selectLayer, removeLayer, toggleVisibility, toggleLock, renameLayer, addLayer,
  } = useEditorLayer(canvas);

  const { transform, reflectTransform, flipHorizontal, flipVertical } = useEditorTransform(canvas);

  const isSelectingSingle = computed(() => selectedObjects.value.length === 1);

  const { save, undo, redo, canUndo, canRedo } = useEditorHistory(canvas, () => {
    refreshLayers();
    selectedObjects.value = [];
    if (canvas.value) canvas.value.isDrawingMode = currentTool.value === "pen";
  });

  const onUpdateSelectingObjects = () => { // 選択状態が変わったときに selectedObjects と変形パネルを更新する
    if (!canvas.value) return;
    selectedObjects.value = canvas.value.getActiveObjects();
    options.onSelectionUpdate?.(selectedObjects.value);
    if (isSelectingSingle.value) reflectTransform();
  };

  const setupEvents = () => { // Fabric.js のキャンバスイベントをまとめて登録する（onMounted 内で呼ぶ）
    if (!canvas.value) return;

    // 選択イベント
    canvas.value.on("selection:created", onUpdateSelectingObjects);
    canvas.value.on("selection:updated", onUpdateSelectingObjects);
    canvas.value.on("selection:cleared", () => {
      selectedObjects.value = [];
    });

    // オブジェクト追加：クロップ枠・パス統合中は無視し、ペン描画中はセーブしない
    canvas.value.on("object:added", (e: fabric.IEvent) => {
      if ((e.target as any)?.name === "crop_frame") return;
      if (isMergingPath.value) return;
      refreshLayers();
      if (!(e.target instanceof fabric.Path && canvas.value?.isDrawingMode)) {
        save();
      }
    });

    // オブジェクト削除：クロップ枠・パス統合中は無視
    canvas.value.on("object:removed", (e: fabric.IEvent) => {
      if ((e.target as any)?.name === "crop_frame") return;
      if (isMergingPath.value) return;
      refreshLayers();
      save();
    });

    // オブジェクト変形：パス統合中は無視し、単一選択なら変形パネルを更新
    canvas.value.on("object:modified", () => {
      if (isMergingPath.value) return;
      save();
      if (isSelectingSingle.value) reflectTransform();
    });

    // ペンのパス統合：新しいパスを既存のパス/グループに追加してレイヤー数を増やさない
    canvas.value.on("path:created", (e: any) => {
      const newPath = e.path as fabric.Path;

      const isPenLayer = (obj: fabric.Object) => // パスまたはパスのみのグループかどうかを判定する
        obj instanceof fabric.Path ||
        (obj instanceof fabric.Group &&
          (obj as fabric.Group)
            .getObjects()
            .every((i) => i instanceof fabric.Path));

      // 選択中レイヤーがペン系であればそこへ統合、なければ最初のペン系レイヤーへ統合
      const selected = selectedObjects.value[0];
      const target =
        selectedObjects.value.length === 1 && isPenLayer(selected)
          ? selected
          : canvas.value
              ?.getObjects()
              .find((obj: any) => obj !== newPath && isPenLayer(obj));

      if (target) {
        isMergingPath.value = true;
        try {
          if (target instanceof fabric.Group) {
            // 既存グループにパスを追加
            canvas.value?.remove(newPath);
            (target as fabric.Group).addWithUpdate(newPath);
            canvas.value?.setActiveObject(target);
          } else {
            // 単体パスとグループ化
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
  };

  return {
    // キャンバス
    canvas, currentTool, toolList, canvasRatioList, size, currentCanvasRatio,
    initCanvas, onChangeCanvasRatio, onChangeTool, onChangeCanvasSize,
    // 選択
    selectedObjects, isSelectingSingle, isMergingPath, setupEvents,
    // 履歴
    save, undo, redo, canUndo, canRedo,
    // レイヤー
    layers, refreshLayers, syncCanvasOrder,
    getLayerType, getLayerLabel, getLayerIcon,
    selectLayer, removeLayer, toggleVisibility, toggleLock, renameLayer, addLayer,
    // 変形
    transform, reflectTransform, flipHorizontal, flipVertical,
  };
};
