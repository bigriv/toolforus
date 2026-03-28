import { fabric } from "fabric";

export const useEditorFile = (canvas: Ref<fabric.Canvas | undefined>) => {
  const extensionList = ["png", "jpeg"];
  const exportFile = ref({
    isShowModal: false,
    name: "image",
    extension: extensionList[0],
  });

  /** エクスポートダイアログの入力値をデフォルトに戻す */
  const resetExportFile = () => {
    exportFile.value.name = "image";
    exportFile.value.extension = extensionList[0];
  };

  /** FileReader の load イベントを受け取り、読み込んだ画像をキャンバスに追加する */
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

  /** FileList から画像ファイルを抽出し、FileReader で読み込んでキャンバスに追加する */
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

  /** エクスポートモーダルを開き、入力値をリセットする */
  const onOpenExportModal = () => {
    exportFile.value.isShowModal = true;
    resetExportFile();
  };

  /** ファイル input の change イベントから画像をインポートする */
  const onImport = (event: Event) => {
    const files = (event.target as HTMLInputElement)?.files;
    if (!files) return;
    importFile(files);
  };

  /** キャンバスを dataURL に変換してファイルとしてダウンロードする */
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

  /** ドラッグ&ドロップイベントから画像をインポートする */
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
