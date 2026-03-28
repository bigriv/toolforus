import { fabric } from "fabric";

export const useEditorHistory = (
  canvas: Ref<fabric.Canvas | undefined>,
  /** アンドゥ/リドゥ後に呼ばれるコールバック（レイヤー更新・選択リセットなど） */
  onRestore: () => void
) => {
  const MAX = 30;
  const history: string[] = reactive([]);
  const historyIndex = ref(-1);
  /** loadFromJSON 中のフラグ（save の二重呼び出しを防ぐ） */
  const isRestoring = ref(false);

  /** 現在のキャンバス状態を JSON でスタックに積む。リドゥ履歴は破棄する */
  const save = () => {
    if (!canvas.value || isRestoring.value) return;
    history.splice(historyIndex.value + 1);
    const json = JSON.stringify(
      canvas.value.toJSON(["name", "selectable", "evented", "visible"])
    );
    history.push(json);
    if (history.length > MAX) {
      history.shift();
    } else {
      historyIndex.value++;
    }
  };

  /** 1つ前の状態に戻す */
  const undo = () => {
    if (!canvas.value || historyIndex.value <= 0) return;
    isRestoring.value = true;
    historyIndex.value--;
    canvas.value.loadFromJSON(JSON.parse(history[historyIndex.value]), () => {
      canvas.value!.renderAll();
      isRestoring.value = false;
      onRestore();
    });
  };

  /** 1つ先の状態に進む */
  const redo = () => {
    if (!canvas.value || historyIndex.value >= history.length - 1) return;
    isRestoring.value = true;
    historyIndex.value++;
    canvas.value.loadFromJSON(JSON.parse(history[historyIndex.value]), () => {
      canvas.value!.renderAll();
      isRestoring.value = false;
      onRestore();
    });
  };

  const canUndo = computed(() => historyIndex.value > 0);
  const canRedo = computed(() => historyIndex.value < history.length - 1);

  return { save, undo, redo, canUndo, canRedo, isRestoring };
};
