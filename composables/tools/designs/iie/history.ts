import { fabric } from "fabric";

export const useIieHistory = (
  canvas: Ref<fabric.Canvas | undefined>,
  onRestore: () => void
) => {
  const MAX = 30;
  const history: string[] = reactive([]);
  const historyIndex = ref(-1);
  const isRestoring = ref(false);

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
