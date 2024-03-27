<script setup lang="ts">
import BasicButton from "@/components/atoms/interfaces/BasicButton.vue";
import ToolDataList from "@/components/molecules/interfaces/ToolDataList.vue";
import { TOUNote } from "@/types/tools/generals/note/note";

const DEFAULT_NOTE_NAME = "Untitled_1";
const textarea: Ref<HTMLElement | null> = ref(null);
const noteName = ref(DEFAULT_NOTE_NAME);
const noteList: Ref<{ [key: string]: TOUNote }> = ref({});
const note = ref(new TOUNote());

const save = () => {
  noteList.value[noteName.value] = note.value;
  localStorage.setItem("tou.note", JSON.stringify(noteList.value));
};
const updateTextarea = () => {
  if (!textarea.value) {
    return;
  }
  textarea.value.innerText = note.value.text;
};
const onAddNote = (noteName: string) => {
  note.value = new TOUNote();
  noteList.value[noteName] = note.value;
  updateTextarea();
};
const onChangeNote = (noteName: string) => {
  note.value = noteList.value[noteName];
  updateTextarea();
};
const onEditNote = (noteName: string) => {
  note.value = noteList.value[noteName];
  updateTextarea();
  save();
};
const onDeleteNote = (noteName: string) => {
  note.value = noteList.value[noteName];
  updateTextarea();
  save();
};
const onClear = () => {
  if (!textarea.value) {
    return;
  }
  if (!textarea.value.innerText) {
    return;
  }
  noteList.value[noteName.value] = note.value;
  note.value = new TOUNote();
  textarea.value.innerText = note.value.text;
};
const onInput = () => {
  if (!textarea.value) {
    return;
  }
  note.value.text = textarea.value.innerText;
};
onMounted(() => {
  const object = JSON.parse(
    JSON.parse(JSON.stringify(localStorage.getItem("tou.note")))
  );
  if (!object || Object.keys(object).length <= 0) {
    noteList.value[noteName.value] = note.value;
    return;
  }
  for (const key of Object.keys(object)) {
    noteList.value[key] = new TOUNote(object[key].text);
  }
  noteName.value = Object.keys(noteList.value)[0];
  note.value = noteList.value[noteName.value];
  updateTextarea();
  window.addEventListener("beforeunload", save);
});
onBeforeUnmount(() => {
  window.removeEventListener("beforeunload", save);
  save();
});
</script>

<template>
  <div class="c-container">
    <div class="c-container__toolbar">
      <div class="c-container__toolbar__menu">
        <ToolDataList
          v-model:selected="noteName"
          v-model:list="noteList"
          :data="note"
          @add="onAddNote"
          @edit="onEditNote"
          @change="onChangeNote"
          @delete="onDeleteNote"
        />
      </div>
      <div class="c-container__toolbar__menu">
        <div class="c-container__toolbar__menu__button">
          <BasicButton label="クリア" @click="onClear" />
        </div>
      </div>
    </div>
    <div class="c-container__note">
      <div
        ref="textarea"
        spellcheck="false"
        contenteditable="true"
        class="c-container__note__layer"
        @input="onInput"
        @blur="save"
      ></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.c-container {
  width: 100%;
  height: 100%;
  &__toolbar {
    display: flex;
    justify-content: space-between;
    width: 100%;
    background-color: white;
    &__menu {
      display: flex;
      height: 2rem;
      &__button {
        width: 4rem;
      }
    }
  }
  &__note {
    position: relative;
    width: 100%;
    height: 600px;
    background-color: white;
    font-family: sans-serif;
    white-space: pre;
    &__layer {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      padding: 0.2rem;
      border: 0.1rem solid black;
      overflow: scroll;
      &:focus {
        outline: 0;
      }
    }
  }
}
</style>
