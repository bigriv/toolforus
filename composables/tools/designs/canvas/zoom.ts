import { fabric } from "fabric";

export const useEditorZoom = (canvas: Ref<fabric.Canvas | undefined>) => {
  const zoom = ref(1);
  const MIN_ZOOM = 0.1;
  const MAX_ZOOM = 8;

  /** ズーム値を MIN_ZOOM〜MAX_ZOOM の範囲にクランプして設定する */
  const setZoom = (newZoom: number) => {
    zoom.value = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, newZoom));
  };

  /** 現在のズームを 1.25 倍にする */
  const zoomIn  = () => setZoom(zoom.value * 1.25);
  /** 現在のズームを 1.25 分の 1 にする */
  const zoomOut = () => setZoom(zoom.value / 1.25);

  /**
   * Ctrl+スクロールでズームするリスナーを登録する。
   * zoom の変化は CSS zoom プロパティ経由でキャンバス要素に適用される。
   */
  const setupZoom = () => {
    if (!canvas.value) return;
    canvas.value.on("mouse:wheel", (opt) => {
      const e = opt.e as WheelEvent;
      if (!e.ctrlKey) return;
      setZoom(zoom.value * (0.999 ** e.deltaY));
      e.preventDefault();
      e.stopPropagation();
    });
  };

  /**
   * ズームツール用のネイティブ mousedown リスナーを upperCanvasEl に登録する。
   * Fabric.js v5 は button !== 0 のイベントを内部でフィルタするため、
   * 右クリック（ズームアウト）には直接 DOM リスナーが必要。
   */
  const setupZoomTool = (getCurrentTool: () => string) => {
    if (!canvas.value) return;
    const upper = (canvas.value as any).upperCanvasEl as HTMLCanvasElement | undefined;
    if (!upper) return;
    upper.addEventListener("mousedown", (e: MouseEvent) => {
      if (getCurrentTool() !== "zoom") return;
      if (e.button === 0) zoomIn();
      else if (e.button === 2) zoomOut();
    });
  };

  return { zoom, zoomIn, zoomOut, setupZoom, setupZoomTool };
};
