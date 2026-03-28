import { fabric } from "fabric";

export const useImageFilter = (canvas: Ref<fabric.Canvas | undefined>) => {
  const filter = reactive({
    /** カラーピッカーキャンセル時に戻すためのバックアップ値 */
    backup: {
      contrast: 0,
      hueRotation: 0,
      saturation: 0,
      brightness: 0,
      blur: 0,
      opacity: 100,
    },
    contrast: 0,
    hueRotation: 0,
    saturation: 0,
    brightness: 0,
    blur: 0,
    opacity: 100,
  });

  // filter の値が変わるたびにアクティブな画像オブジェクトへ即時反映する
  watch(
    () => filter,
    () => {
      if (!canvas.value) return;
      const activeImages = canvas.value
        .getActiveObjects()
        .filter((object) => object instanceof fabric.Image);
      if (activeImages.length !== 1) return;
      const image = activeImages[0] as fabric.Image;
      image.filters = [];
      image.applyFilters([
        new fabric.Image.filters.Contrast({ contrast: filter.contrast / 100 }),
        new fabric.Image.filters.HueRotation({ rotation: filter.hueRotation / 100 }),
        new fabric.Image.filters.Blur({ blur: filter.blur / 100 }),
        new fabric.Image.filters.Brightness({ brightness: filter.brightness / 100 }),
        new fabric.Image.filters.Saturation({ saturation: filter.saturation / 100 }),
      ]);
      image.set({ opacity: filter.opacity / 100 });
      canvas.value.renderAll();
    },
    { deep: true }
  );

  /** filter の全値をデフォルト（無補正）にリセットする */
  const resetFilter = () => {
    filter.contrast = 0;
    filter.hueRotation = 0;
    filter.saturation = 0;
    filter.brightness = 0;
    filter.blur = 0;
    filter.opacity = 100;
  };

  /** アクティブな画像オブジェクトの現在値を filter に反映する（選択変更後に呼ぶ） */
  const reflectFilter = () => {
    resetFilter();
    if (!canvas.value) return;
    const activeImages = canvas.value
      .getActiveObjects()
      .filter((object) => object instanceof fabric.Image);
    if (activeImages.length !== 1) return;
    const image = activeImages[0] as fabric.Image;
    filter.opacity = (image.opacity ?? 1) * 100;
  };

  /** カラーピッカーを開く前に現在の filter 値をバックアップする */
  const backupFilter = () => {
    if (!canvas.value) return;
    const activeImages = canvas.value
      .getActiveObjects()
      .filter((object) => object instanceof fabric.Image);
    if (activeImages.length !== 1) return;
    filter.backup.contrast = filter.contrast;
    filter.backup.hueRotation = filter.hueRotation;
    filter.backup.saturation = filter.saturation;
    filter.backup.brightness = filter.brightness;
    filter.backup.blur = filter.blur;
    filter.backup.opacity = filter.opacity;
  };

  /** バックアップした値に filter を戻す（カラーピッカーキャンセル時に呼ぶ） */
  const rollbackFilter = () => {
    filter.contrast = filter.backup.contrast;
    filter.hueRotation = filter.backup.hueRotation;
    filter.saturation = filter.backup.saturation;
    filter.brightness = filter.backup.brightness;
    filter.blur = filter.backup.blur;
    filter.opacity = filter.backup.opacity;
  };

  return { filter, reflectFilter, backupFilter, rollbackFilter };
};
