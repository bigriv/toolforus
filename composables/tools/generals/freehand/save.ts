import { TOUFreehandNote } from "@/types/tools/generals/freehand/freehand";

export const useFreehandNoteSave = (note: Ref<TOUFreehandNote>) => {
  const DEFAULT_NOTE_NAME = "Untitled_1";

  const noteList: Ref<{ [key: string]: TOUFreehandNote }> = ref({});
  const noteName: Ref<string> = ref(DEFAULT_NOTE_NAME);

  const save = () => {
    noteList.value[noteName.value] = note.value;
    let saveObject: { [key: string]: Object } = {};
    for (const key of Object.keys(noteList.value)) {
      saveObject[key] = noteList.value[key].toJson();
    }
    localStorage.setItem("tou.freehand", JSON.stringify(saveObject));
  };

  const load = () => {
    const object = JSON.parse(
      JSON.parse(JSON.stringify(localStorage.getItem("tou.freehand")))
    );
    if (!object || Object.keys(object).length <= 0) {
      // 保存データが正しく取得できなかった場合
      noteList.value[noteName.value] = note.value;
      return;
    }
    for (const key of Object.keys(object)) {
      noteList.value[key] = TOUFreehandNote.build(object[key]);
    }
    noteName.value = Object.keys(noteList.value)[0];
    note.value = noteList.value[noteName.value];
  };

  const onAddFreehandNote = (noteName: string) => {
    note.value = new TOUFreehandNote();
    noteList.value[noteName] = note.value;
  };
  const onEditFreehandNote = (noteName: string) => {
    note.value = noteList.value[noteName];
    save();
  };
  const onChangeFreehandNote = (noteName: string) => {
    note.value = noteList.value[noteName];
  };
  const onDeleteFreehandNote = (noteName: string) => {
    note.value = noteList.value[noteName];
    save();
  };

  return {
    noteList,
    noteName,
    save,
    load,
    onAddFreehandNote,
    onEditFreehandNote,
    onChangeFreehandNote,
    onDeleteFreehandNote,
  };
};
