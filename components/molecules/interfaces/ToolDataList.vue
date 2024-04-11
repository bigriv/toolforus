<script setup lang="ts">
import InputText from "@/components/atoms/interfaces/InputText.vue";
import ToolButton from "@/components/atoms/interfaces/ToolButton.vue";
import type { TOUSavable } from "@/types/common/savable";

const props = defineProps({
  selected: {
    type: String,
    required: true,
  },
  data: {
    type: Object as PropType<TOUSavable>,
    required: true,
  },
  list: {
    type: Object as PropType<{ [key: string]: TOUSavable }>,
    required: true,
  },
});
const emits = defineEmits([
  "update:list",
  "update:selected",
  "change",
  "add",
  "edit",
  "delete",
]);

const data = computed(() => props.data);
const list = computed({
  get: () => props.list,
  set: (newValue) => emits("update:list", newValue),
});
const selected = computed({
  get: () => props.selected,
  set: (newValue) => emits("update:selected", newValue),
});
const edit = reactive({
  isEditing: false,
  before: "",
  after: "",
});
const isSubmitable = computed(() =>
  list.value ? !list.value[edit.after] : []
);
const isDeletable = computed(() =>
  list.value ? Object.keys(list.value).length > 1 : false
);

const onChange = (e: Event) => {
  // 現在の内容をリストに格納
  list.value[selected.value] = data.value;
  // セレクトボックスの選択値を変更
  const newSelect = (e.target as HTMLSelectElement).value;
  selected.value = newSelect;
  emits("change", newSelect);
};
const onEdit = () => {
  edit.isEditing = true;
  edit.before = selected.value;
  edit.after = selected.value;
};
const onAdd = () => {
  // 新規追加前に現在の内容を保持
  list.value[selected.value] = data.value;

  // Untitile_の最大値を取得
  const keyList = Object.keys(list.value)
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

  // 新しいデータを作成
  const newName = "Untitled_" + (max + 1);
  selected.value = newName;
  emits("add", newName);
};
const onEditSave = () => {
  edit.isEditing = false;
  if (edit.before === edit.after) {
    return;
  }
  list.value[edit.after] = list.value[edit.before];
  delete list.value[edit.before];
  selected.value = edit.after;
  emits("edit", edit.after);
};
const onEditCancel = () => {
  edit.isEditing = false;
  edit.before = "";
  edit.after = "";
};
const onDelete = () => {
  edit.isEditing = false;
  delete list.value[edit.before];
  const newName = Object.keys(list.value)[0];
  selected.value = newName;
  emits("delete", newName);
};
</script>

<template>
  <div class="c-tool_data_list">
    <div v-if="edit.isEditing" class="c-tool_data_list__edit_input">
      <InputText v-model:text="edit.after" />
    </div>
    <div v-else class="c-tool_data_list__data_list">
      <select :value="selected" @change.prevent.stop="onChange">
        <option v-for="(__data, name) in list" :key="name">
          {{ name }}
        </option>
      </select>
    </div>
    <template v-if="edit.isEditing">
      <div>
        <ToolButton
          icon="/commons/icons/flag.svg"
          label="保存"
          :disabled="!isSubmitable"
          @click="onEditSave"
        />
      </div>
      <div>
        <ToolButton
          icon="/commons/icons/close.svg"
          label="キャンセル"
          color="red"
          @click="onEditCancel"
        />
      </div>
      <div>
        <ToolButton
          icon="/commons/icons/delete.svg"
          label="削除"
          color="red"
          :disabled="!isDeletable"
          @click="onDelete"
        />
      </div>
    </template>
    <template v-else>
      <div>
        <ToolButton
          icon="/commons/icons/pen.svg"
          label="編集"
          @click="onEdit"
        />
      </div>
      <div>
        <ToolButton icon="/commons/icons/add.svg" label="新規" @click="onAdd" />
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.c-tool_data_list {
  display: flex;
  height: 100%;
  &__edit_input {
    width: 10rem;
    height: 100%;
  }
  &__data_list {
    select {
      width: 10rem;
      height: 100%;
      cursor: pointer;
      &:focus {
        outline: 0;
      }
    }
  }
}
</style>
