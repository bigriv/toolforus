import { fabric } from "fabric";

export type LayerType = "image" | "text" | "shape" | "pen" | "other";

let _idCounter = 0;

export const useEditorLayer = (canvas: Ref<fabric.Canvas | undefined>) => {
  const layers: Ref<fabric.Object[]> = ref([]);

  /**
   * キャンバスのオブジェクト一覧からレイヤーリストを再構築する。
   * クロップ枠は除外し、上レイヤーが先頭になるよう逆順にする。
   * 未採番のオブジェクトには一意のIDを付与する。
   */
  const refreshLayers = () => {
    if (!canvas.value) {
      layers.value = [];
      return;
    }
    layers.value = [...canvas.value.getObjects()]
      .filter((obj) => (obj as any).name !== "crop_frame")
      .reverse();
    layers.value.forEach((obj: any) => {
      if ((obj as any).layerId === undefined) {
        (obj as any).layerId = ++_idCounter;
      }
    });
  };

  /**
   * レイヤーの並び順をキャンバス内部のオブジェクトに反映する。
   * クロップ枠は常に最前面に保持する。
   */
  const syncCanvasOrder = () => {
    if (!canvas.value) return;
    const internalObjects = (canvas.value as any)._objects as fabric.Object[];
    const cropFrames = internalObjects.filter(
      (o) => (o as any).name === "crop_frame"
    );
    const newOrder = [...layers.value].reverse();
    internalObjects.length = 0;
    newOrder.forEach((o) => internalObjects.push(o));
    cropFrames.forEach((o) => internalObjects.push(o));
    canvas.value.renderAll();
  };

  /**
   * パスのみで構成されたオブジェクトかどうかを判定する。（ペンレイヤーの識別に使用）
   * @param obj レイヤーオブジェクト
   * @returns パスのみで構成されたオブジェクトならtrue、それ以外はfalse。
   */
  const isPenGroup = (obj: fabric.Object): boolean => {
    if (!(obj instanceof fabric.Group)) return false;
    return (obj as fabric.Group)
      .getObjects()
      .every((item) => item instanceof fabric.Path);
  };

  /** 
   * オブジェクトの型をレイヤー種別に変換して返す。
   * @param obj オブジェクト
   * @returns レイヤー種別
   */
  const getLayerType = (obj: fabric.Object): LayerType => {
    if (obj instanceof fabric.Image) return "image";
    if (obj instanceof fabric.Text) return "text";
    if (obj instanceof fabric.Path) return "pen";
    if (isPenGroup(obj)) return "pen";
    if (
      obj instanceof fabric.Ellipse ||
      obj instanceof fabric.Rect ||
      obj instanceof fabric.Triangle
    )
      return "shape";
    return "other";
  };

  /**
   * レイヤーパネルに表示するラベルを返す。
   * カスタム名が設定されていればそれを優先する。
   * @param obj レイヤーオブジェクト
   * @returns レイヤー名
   */
  const getLayerLabel = (obj: fabric.Object): string => {
    if ((obj as any).customName) return (obj as any).customName;
    if (obj instanceof fabric.Text) {
      const text = (obj.text ?? "").trim();
      return text.length > 12 ? text.slice(0, 12) + "…" : text || "テキスト";
    }
    if (obj instanceof fabric.Image) return "画像";
    if (obj instanceof fabric.Ellipse) return "楕円";
    if (obj instanceof fabric.Rect) return "四角形";
    if (obj instanceof fabric.Triangle) return "三角形";
    if (obj instanceof fabric.Path) return "ペン";
    if (isPenGroup(obj)) return "ペン";
    return "オブジェクト";
  };

  /**
   * レイヤーにカスタム名を設定する。空文字の場合は削除してデフォルトラベルに戻す。
   * @param obj レイヤーオブジェクト
   * @param name カスタム名
   */
  const renameLayer = (obj: fabric.Object, name: string) => {
    (obj as any).customName = name.trim() || undefined;
  };

  /**
   * 指定タイプの新規レイヤーをキャンバスに追加する。
   * @param type レイヤー種別
   * - shape: 図形描画レイヤー
   * - path : ペン描画レイヤー
   * - text : テキストの描画レイヤー
   */
  const addLayer = (type: Exclude<LayerType, "image" | "other"> = "pen") => {
    if (!canvas.value) return undefined;
    let obj: fabric.Object;
    if (type === "pen") {
      obj = new fabric.Group([], {
        left: 0,
        top: 0,
        width: canvas.value.getWidth(),
        height: canvas.value.getHeight(),
        selectable: true,
        evented: true,
      });
    } else if (type === "text") {
      obj = new fabric.Textbox("テキスト", {
        left: 50,
        top: 50,
        width: 200,
        fontSize: 24,
        fill: "#000000",
        selectable: true,
        evented: true,
      });
    } else {
      obj = new fabric.Rect({
        left: 0,
        top: 0,
        width: canvas.value.getWidth(),
        height: canvas.value.getHeight(),
        fill: "rgba(0,0,0,0)",
        strokeWidth: 0,
        selectable: true,
        evented: true,
      });
    }
    canvas.value.add(obj);
    refreshLayers();
    return obj;
  };

  /**
   * レイヤー種別に対応するアイコンパスを返す。
   * @param type レイヤー種別
   */
  const getLayerIcon = (type: LayerType): string => {
    const ICON_PATH ="/commons/icons/";
    switch (type) {
      case "image":
        return `${ICON_PATH}image.svg`;
      case "text":
        return `${ICON_PATH}title.svg`;
      case "shape":
        return `${ICON_PATH}category.svg`;
      case "pen":
        return `${ICON_PATH}pen_draw.svg`;
      default:
        return `${ICON_PATH}category.svg`;
    }
  };

  /**
   * 指定オブジェクトを選択状態にする（ロック中は無視）。
   * @param obj レイヤーオブジェクト
   */
  const selectLayer = (obj: fabric.Object) => {
    if (!canvas.value || !obj.selectable) return;
    canvas.value.setActiveObject(obj);
    canvas.value.renderAll();
  };

  /**
   * 指定オブジェクトをキャンバスから削除し、レイヤーリストを更新する。
   * @param obj レイヤーオブジェクト
   */
  const removeLayer = (obj: fabric.Object) => {
    if (!canvas.value) return;
    if (canvas.value.getActiveObject() === obj) {
      canvas.value.discardActiveObject();
    }
    canvas.value.remove(obj);
    refreshLayers();
  };

  /**
   * レイヤーの表示/非表示を切り替える。
   * @param obj レイヤーオブジェクト
   */
  const toggleVisibility = (obj: fabric.Object) => {
    obj.set({ visible: !obj.visible });
    canvas.value?.renderAll();
  };

  /**
   * レイヤーの選択可能状態を切り替える。ロック時は選択も解除する。
   * @param obj レイヤーオブジェクト
   */
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
    selectLayer,
    removeLayer,
    toggleVisibility,
    toggleLock,
    renameLayer,
    addLayer,
  };
};
