import { fabric } from "fabric";

export type LayerType = "image" | "text" | "shape" | "path" | "other";

let _idCounter = 0;

export const useIieLayer = (canvas: Ref<fabric.Canvas | undefined>) => {
  const layers: Ref<fabric.Object[]> = ref([]);

  const refreshLayers = () => {
    if (!canvas.value) {
      layers.value = [];
      return;
    }
    // crop_frame はレイヤーパネルに表示しない。上がリスト先頭 = 前面になるよう逆順
    layers.value = [...canvas.value.getObjects()]
      .filter((obj) => (obj as any).name !== "crop_frame")
      .reverse();
    // vuedraggable の item-key 用に安定した ID を付与
    layers.value.forEach((obj) => {
      if ((obj as any).__tou_id === undefined) {
        (obj as any).__tou_id = ++_idCounter;
      }
    });
  };

  // vuedraggable がレイヤー配列を更新した後に canvas の順序を同期する
  const syncCanvasOrder = () => {
    if (!canvas.value) return;
    const internalObjects = (canvas.value as any)._objects as fabric.Object[];
    const cropFrames = internalObjects.filter(
      (o) => (o as any).name === "crop_frame"
    );
    // layers[0] = 前面、逆順にすると canvas の back-to-front 順になる
    const newOrder = [...layers.value].reverse();
    internalObjects.length = 0;
    newOrder.forEach((o) => internalObjects.push(o));
    cropFrames.forEach((o) => internalObjects.push(o));
    canvas.value.renderAll();
  };

  const isPenGroup = (obj: fabric.Object): boolean => {
    if (!(obj instanceof fabric.Group)) return false;
    return (obj as fabric.Group)
      .getObjects()
      .every((item) => item instanceof fabric.Path);
  };

  const getLayerType = (obj: fabric.Object): LayerType => {
    if (obj instanceof fabric.Image) return "image";
    if (obj instanceof fabric.Text) return "text";
    if (obj instanceof fabric.Path) return "path";
    if (isPenGroup(obj)) return "path";
    if (
      obj instanceof fabric.Ellipse ||
      obj instanceof fabric.Rect ||
      obj instanceof fabric.Triangle
    )
      return "shape";
    return "other";
  };

  const getLayerLabel = (obj: fabric.Object): string => {
    if (obj instanceof fabric.Text) {
      const text = (obj.text ?? "").trim();
      return text.length > 12 ? text.slice(0, 12) + "…" : text || "テキスト";
    }
    if (obj instanceof fabric.Image) return "画像";
    if (obj instanceof fabric.Ellipse) return "楕円";
    if (obj instanceof fabric.Rect) return "四角形";
    if (obj instanceof fabric.Triangle) return "三角形";
    if (obj instanceof fabric.Path) return "パス";
    if (isPenGroup(obj)) return "パス";
    return "オブジェクト";
  };

  const getLayerIcon = (type: LayerType): string => {
    switch (type) {
      case "image":
        return "/commons/icons/image.svg";
      case "text":
        return "/commons/icons/title.svg";
      case "shape":
        return "/commons/icons/category.svg";
      case "path":
        return "/commons/icons/pen_draw.svg";
      default:
        return "/commons/icons/category.svg";
    }
  };

  const isLayerSelected = (obj: fabric.Object): boolean => {
    if (!canvas.value) return false;
    return canvas.value.getActiveObjects().includes(obj);
  };

  const selectLayer = (obj: fabric.Object) => {
    if (!canvas.value || !obj.selectable) return;
    canvas.value.setActiveObject(obj);
    canvas.value.renderAll();
  };

  const removeLayer = (obj: fabric.Object) => {
    if (!canvas.value) return;
    if (canvas.value.getActiveObject() === obj) {
      canvas.value.discardActiveObject();
    }
    canvas.value.remove(obj);
    refreshLayers();
  };

  const toggleVisibility = (obj: fabric.Object) => {
    obj.set({ visible: !obj.visible });
    canvas.value?.renderAll();
  };

  const toggleLock = (obj: fabric.Object) => {
    const willLock = obj.selectable;
    obj.set({ selectable: !willLock, evented: !willLock });
    if (willLock && canvas.value?.getActiveObject() === obj) {
      canvas.value.discardActiveObject();
      canvas.value.renderAll();
    } else {
      canvas.value?.renderAll();
    }
  };

  return {
    layers,
    refreshLayers,
    syncCanvasOrder,
    getLayerType,
    getLayerLabel,
    getLayerIcon,
    isLayerSelected,
    selectLayer,
    removeLayer,
    toggleVisibility,
    toggleLock,
  };
};
