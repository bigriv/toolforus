import { fabric } from "fabric";

export const useIieFile = (canvas: Ref<fabric.Canvas | undefined>) => {
  const extensionList = ["png", "jpeg"];
  const exportFile = ref({
    isShowModal: false,
    name: "image",
    extension: extensionList[0],
  });

  const resetExportFile = () => {
    exportFile.value.name = "image";
    exportFile.value.extension = extensionList[0];
  };

  const loadFile = (event: Event) => {
    if (!canvas.value) return;
    const imageData = (event.target as FileReader).result;
    if (!imageData) return;
    fabric.Image.fromURL(
      imageData instanceof ArrayBuffer
        ? Buffer.from(imageData).toString()
        : imageData,
      (img) => {
        if (!canvas.value) return;
        canvas.value.add(img);
      }
    );
  };

  const importFile = (files: FileList) => {
    const imageFiles = Array.from(files).filter((file) =>
      /\.(jpeg|png|bmp|tiff|gif)$/i.test(file.name)
    );
    if (imageFiles.length <= 0) return;
    for (let i = 0; i < imageFiles.length; i++) {
      const reader = new FileReader();
      reader.onload = (event: Event) => loadFile(event);
      reader.readAsDataURL(imageFiles[i]);
    }
  };

  const onOpenExportModal = () => {
    exportFile.value.isShowModal = true;
    resetExportFile();
  };

  const onImport = (event: Event) => {
    const files = (event.target as HTMLInputElement)?.files;
    if (!files) return;
    importFile(files);
  };

  const onExport = () => {
    if (!canvas.value) return;
    const dataURL = canvas.value.toDataURL({
      format: exportFile.value.extension,
      quality: 1,
    });
    let fileName = exportFile.value.name.replace(/\s/g, "");
    if (!fileName) fileName = "untitled";
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = fileName + "." + exportFile.value.extension;
    link.click();
  };

  const onDropFile = (event: DragEvent) => {
    if (!event?.dataTransfer) return;
    importFile(event.dataTransfer.files);
  };

  return {
    extensionList,
    exportFile,
    onOpenExportModal,
    onImport,
    onExport,
    onDropFile,
  };
};
