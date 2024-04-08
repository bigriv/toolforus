import { fabric } from "fabric";

export const useIieFilter = (canvas: ComputedRef<fabric.Canvas>) => {
  const filter = reactive({
    isShowModal: false,
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
  watch(
    () => filter,
    () => {
      const activeImages = canvas.value
        .getActiveObjects()
        .filter((object) => object instanceof fabric.Image);
      if (activeImages.length !== 1) {
        return;
      }
      const image = activeImages[0] as fabric.Image;
      image.filters = [];
      image.applyFilters([
        new fabric.Image.filters.Contrast({
          contrast: filter.contrast / 100,
        }),
        new fabric.Image.filters.HueRotation({
          rotation: filter.hueRotation / 100,
        }),
        new fabric.Image.filters.Blur({
          blur: filter.blur / 100,
        }),
        new fabric.Image.filters.Brightness({
          brightness: filter.brightness / 100,
        }),
        new fabric.Image.filters.Saturation({
          saturation: filter.saturation / 100,
        }),
      ]);
      image.set({
        opacity: filter.opacity / 100,
      });
      canvas.value.renderAll();
    },
    { deep: true }
  );
  const resetFilter = () => {
    filter.contrast = 0;
    filter.hueRotation = 0;
    filter.saturation = 0;
    filter.brightness = 0;
    filter.blur = 0;
    filter.opacity = 100;
  };
  const reflectFilter = () => {
    resetFilter();
    const activeImages = canvas.value
      .getActiveObjects()
      .filter((object) => object instanceof fabric.Image);
    if (activeImages.length !== 1) {
      // 図形が一つも選択状態になっていないか複数選択されている場合は何もしない
      return;
    }
    const image = activeImages[0] as fabric.Image;
    filter.opacity = (image.opacity ?? 1) * 100;
  };

  const backupFilter = () => {
    const activeImages = canvas.value
      .getActiveObjects()
      .filter((object) => object instanceof fabric.Image);
    if (activeImages.length !== 1) {
      return;
    }
    const image = activeImages[0] as fabric.Image;
    filter.backup.contrast = 0;
    filter.backup.hueRotation = 0;
    filter.backup.saturation = 0;
    filter.backup.brightness = 0;
    filter.backup.blur = 0;
    filter.backup.opacity = (image.opacity ?? 1) * 100;
  };

  const rollbackFilter = () => {
    filter.contrast = filter.backup.contrast;
    filter.hueRotation = filter.backup.hueRotation;
    filter.saturation = filter.backup.saturation;
    filter.brightness = filter.backup.brightness;
    filter.blur = filter.backup.blur;
    filter.opacity = filter.backup.opacity;
  };

  return {
    filter,
    reflectFilter,
    backupFilter,
    rollbackFilter,
  };
};
