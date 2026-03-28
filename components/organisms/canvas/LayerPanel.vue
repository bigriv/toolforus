<script setup lang="ts">
import draggable from "vuedraggable";

export interface LayerItem {
  id: string;
  label: string;
  typeIcon: string;
  visible: boolean;
  locked: boolean;
}

const props = withDefaults(defineProps<{
  layers: LayerItem[];
  selectedIds: string[];
  showAdd?: boolean;
}>(), {
  showAdd: true,
});

const emits = defineEmits<{
  sorted: [newLayers: LayerItem[]];
  select: [id: string];
  remove: [id: string];
  "toggle-visibility": [id: string];
  "toggle-lock": [id: string];
  rename: [id: string, newName: string];
  add: [];
}>();

// 内部ソート用。props.layers が変わったら同期する
const sortableLayers = ref<LayerItem[]>([...props.layers]);

watch(
  () => props.layers,
  (newLayers) => {
    sortableLayers.value = [...newLayers];
  },
  { deep: true }
);

const onSorted = () => {
  emits("sorted", [...sortableLayers.value]);
};

// インライン名前編集
const editingId = ref<string | null>(null);
const editingName = ref("");
const inputRef = ref<HTMLInputElement | null>(null);

const startEdit = (item: LayerItem) => {
  editingId.value = item.id;
  editingName.value = item.label;
  nextTick(() => {
    inputRef.value?.select();
  });
};

const commitEdit = () => {
  if (editingId.value === null) return;
  emits("rename", editingId.value, editingName.value);
  editingId.value = null;
};

const cancelEdit = () => {
  editingId.value = null;
};
</script>

<template>
  <div class="c-layer-panel">
    <div class="c-layer-panel__header">
      <span>レイヤー</span>
      <button v-if="showAdd" class="c-layer-panel__add-btn" title="レイヤーを追加" @click="emits('add')">
        <img src="/commons/icons/add.svg" />
      </button>
    </div>
    <draggable
      v-model="sortableLayers"
      item-key="id"
      ghost-class="c-layer-panel__item--ghost"
      chosen-class="c-layer-panel__item--chosen"
      animation="150"
      @end="onSorted"
    >
      <template #item="{ element: item }">
        <div
          class="c-layer-panel__item"
          :class="{
            'c-layer-panel__item--selected': selectedIds.includes(item.id),
            'c-layer-panel__item--hidden': !item.visible,
          }"
          @click="emits('select', item.id)"
        >
          <img
            class="c-layer-panel__item__type"
            :src="item.typeIcon"
            :alt="item.label"
            draggable="false"
          />
          <input
            v-if="editingId === item.id"
            ref="inputRef"
            v-model="editingName"
            class="c-layer-panel__item__input"
            @click.stop
            @keydown.enter.prevent="commitEdit"
            @keydown.escape.prevent="cancelEdit"
            @blur="commitEdit"
          />
          <span
            v-else
            class="c-layer-panel__item__label"
            @dblclick.stop="startEdit(item)"
          >{{ item.label }}</span>
          <button
            class="c-layer-btn"
            :title="item.visible ? '非表示にする' : '表示する'"
            @click.stop="emits('toggle-visibility', item.id)"
          >
            <img
              :src="
                item.visible
                  ? '/commons/icons/visibility.svg'
                  : '/commons/icons/visibility_off.svg'
              "
            />
          </button>
          <button
            class="c-layer-btn"
            :title="item.locked ? 'ロック解除' : 'ロックする'"
            @click.stop="emits('toggle-lock', item.id)"
          >
            <img
              :src="
                item.locked
                  ? '/commons/icons/lock.svg'
                  : '/commons/icons/lock_open.svg'
              "
            />
          </button>
          <button
            class="c-layer-btn c-layer-btn--delete"
            title="削除"
            @click.stop="emits('remove', item.id)"
          >
            <img src="/commons/icons/delete.svg" />
          </button>
        </div>
      </template>
    </draggable>
  </div>
</template>

<style scoped lang="scss">
.c-layer-panel {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  background: white;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.3rem 0.5rem;
    font-size: 0.75rem;
    font-weight: bold;
    background: #f0f0f0;
    border-bottom: 0.1rem solid #ddd;
    flex-shrink: 0;
  }

  &__add-btn {
    width: 1.4rem;
    height: 1.4rem;
    padding: 0;
    border: 0.05rem solid #ccc;
    background: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.2rem;

    img {
      width: 1rem;
      height: 1rem;
    }

    &:hover {
      background: #e0e0e0;
    }
  }

  &__item {
    display: flex;
    align-items: center;
    padding: 0.3rem 0.4rem;
    gap: 0.3rem;
    min-height: 2.2rem;
    border-bottom: 0.05rem solid #eee;
    cursor: grab;
    font-size: 0.7rem;

    &:hover {
      background: #f5f5f5;

      .c-layer-btn--delete {
        display: flex;
      }
    }

    &--selected {
      background: #e8e8ff;

      &:hover {
        background: #ddddf8;
      }
    }

    &--hidden {
      opacity: 0.5;
    }

    &--ghost {
      opacity: 0.35;
      background: #e8e8ff;
    }

    &--chosen {
      background: #ddddf8;
    }

    .c-layer-btn--delete {
      display: none;
    }

    &__type {
      flex-shrink: 0;
      width: 1rem;
      height: 1rem;
    }

    &__label {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      min-width: 0;
    }

    &__input {
      flex: 1;
      min-width: 0;
      font-size: 0.7rem;
      padding: 0.1rem 0.2rem;
      border: 0.1rem solid #888;
      border-radius: 0.2rem;
      outline: none;
    }
  }
}

.c-layer-btn {
  width: 1.8rem;
  height: 1.8rem;
  padding: 0;
  border: 0.05rem solid #ccc;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 0.2rem;

  img {
    width: 1.1rem;
    height: 1.1rem;
  }

  &:hover {
    background: #e0e0e0;
  }

  &--delete:hover {
    background: #ffeeee;

    img {
      filter: invert(15%) sepia(95%) saturate(6932%) hue-rotate(358deg)
        brightness(95%) contrast(112%);
    }
  }
}
</style>
