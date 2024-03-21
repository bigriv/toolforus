<script setup lang="ts">
import ToolButton from "@/components/atoms/interfaces/ToolButton.vue";
import BasicButton from "@/components/atoms/interfaces/BasicButton.vue";
import InputText from "@/components/atoms/interfaces/InputText.vue";

const DEFAULT_NOTE_NAME = "Untitled_1";
const textarea: Ref<HTMLElement | null> = ref(null);
const edit = reactive({
  isEditing: false,
  before: "",
  after: "",
});
const isSubmitable = computed(() => !noteList.value[edit.after]);
const isDeletable = computed(() => Object.keys(noteList.value).length > 1);
const noteName = ref(DEFAULT_NOTE_NAME);
const noteList: Ref<{ [key: string]: string }> = ref({});

const save = () => {
  if (!textarea.value) {
    return;
  }
  if (!textarea.value.innerText) {
    return;
  }
  noteList.value[noteName.value] = textarea.value.innerText;
  localStorage.setItem("tou.note", JSON.stringify(noteList.value));
};
const onChangeNote = (e: Event) => {
  save();
  noteName.value = (e.target as HTMLSelectElement).value;
  if (!textarea.value) {
    return;
  }
  textarea.value.innerText = noteList.value[noteName.value];
};
const onEdit = () => {
  edit.isEditing = true;
  edit.before = noteName.value;
  edit.after = noteName.value;
};
const onAdd = () => {
  if (!textarea.value) {
    return;
  }
  save();
  const keyList = Object.keys(noteList.value)
    .filter((key) => /^Untitled_\d+$/.test(key))
    .map((key) => key.replace(/^Untitled_/, ""));
  let max = 1;
  for (const key of keyList) {
    const num = Number(key);
    if (Number.isNaN(num)) {
      continue;
    }
    if (num > max) {
      max = num;
    }
  }
  noteName.value = "Untitled_" + (max + 1);
  noteList.value[noteName.value] = "";
  textarea.value.innerText = "";
};
const onEditSave = () => {
  edit.isEditing = false;
  if (edit.before === edit.after) {
    return;
  }
  noteList.value[edit.after] = noteList.value[edit.before];
  delete noteList.value[edit.before];
  noteName.value = edit.after;
};
const onEditCancel = () => {
  edit.isEditing = false;
  edit.before = "";
  edit.after = "";
};
const onDelete = () => {
  if (!textarea.value) {
    return;
  }
  edit.isEditing = false;
  delete noteList.value[edit.before];
  noteName.value = Object.keys(noteList.value)[0];
  textarea.value.innerText = noteList.value[noteName.value];
};
const onClear = () => {
  if (!textarea.value) {
    return;
  }
  if (!textarea.value.innerText) {
    return;
  }
  noteList.value[noteName.value] = "";
  textarea.value.innerText = "";
};

onMounted(() => {
  const object = JSON.parse(
    JSON.parse(JSON.stringify(localStorage.getItem("tou.note")))
  );
  if (!object || Object.keys(object).length <= 0) {
    noteList.value[noteName.value] = "";
    return;
  }
  for (const key of Object.keys(object)) {
    noteList.value[key] = object[key];
  }
  if (!Object.keys(object).includes(DEFAULT_NOTE_NAME)) {
    noteList.value[DEFAULT_NOTE_NAME] = "";
  }
});
onUnmounted(() => {
  save();
});
</script>

<template>
  <div class="c-container">
    <div class="c-container__toolbar">
      <div class="c-container__toolbar__menu">
        <div
          v-if="edit.isEditing"
          class="c-container__toolbar__menu__edit_input"
        >
          <InputText v-model:text="edit.after" />
        </div>
        <div v-else class="c-container__toolbar__menu__note_list">
          <select :value="noteName" @change.prevent.stop="onChangeNote">
            <option v-for="(__note, name) in noteList" :key="name">
              {{ name }}
            </option>
          </select>
        </div>
        <template v-if="edit.isEditing">
          <div>
            <ToolButton :disabled="!isSubmitable" @click="onEditSave">
              <img src="/commons/icons/flag.svg" alt="保存" />
            </ToolButton>
          </div>
          <div>
            <ToolButton @click="onEditCancel">
              <img
                class="u-icon--red"
                src="/commons/icons/close.svg"
                alt="キャンセル"
              />
            </ToolButton>
          </div>
          <div>
            <ToolButton :disabled="!isDeletable" @click="onDelete">
              <img
                class="u-icon--red"
                src="/commons/icons/delete.svg"
                alt="削除"
              />
            </ToolButton>
          </div>
        </template>
        <template v-else>
          <div>
            <ToolButton @click="onEdit">
              <img src="/commons/icons/pen.svg" alt="編集" />
            </ToolButton>
          </div>
          <div>
            <ToolButton @click="onAdd">
              <img src="/commons/icons/add.svg" alt="新規" />
            </ToolButton>
          </div>
        </template>
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
      &__edit_input {
        width: 10rem;
        height: 100%;
      }
      &__note_list {
        select {
          width: 10rem;
          height: 100%;
          cursor: pointer;
          &:focus {
            outline: 0;
          }
        }
      }
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
.u-icon--red {
  filter: invert(15%) sepia(95%) saturate(6932%) hue-rotate(358deg)
    brightness(95%) contrast(112%);
}
</style>
