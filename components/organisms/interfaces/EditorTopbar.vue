<script setup lang="ts">
import ToolFileButton from "@/components/atoms/interfaces/ToolFileButton.vue";
import ToolButton from "@/components/atoms/interfaces/ToolButton.vue";
import ToolRadioButtons from "@/components/atoms/interfaces/ToolRadioButtons.vue";
import InputNumber from "@/components/molecules/interfaces/InputNumber.vue";

const props = defineProps<{
  ratioList: { value: string; label: string }[];
  currentRatio: string;
  canvasWidth: number;
  canvasHeight: number;
  canUndo: boolean;
  canRedo: boolean;
  showImport?: boolean;
}>();

const emits = defineEmits<{
  import: [event: Event];
  "export-open": [];
  undo: [];
  redo: [];
  "change-ratio": [ratio: string];
  "change-size": [];
}>();

const currentRatio = computed({
  get: () => props.currentRatio,
  set: (v) => emits("change-ratio", v),
});

const canvasWidth = computed({
  get: () => props.canvasWidth,
  set: () => emits("change-size"),
});

const canvasHeight = computed({
  get: () => props.canvasHeight,
  set: () => emits("change-size"),
});
</script>

<template>
  <div class="c-editor-topbar">
    <ToolFileButton
      v-if="showImport"
      accept=".jpeg,.png,.bmp,.tiff,.gif"
      icon="/commons/icons/upload_file.svg"
      label="インポート"
      @change="emits('import', $event)"
    />
    <ToolButton
      icon="/commons/icons/download.svg"
      label="エクスポート"
      @click="emits('export-open')"
    />
    <div class="c-editor-topbar__sep" />
    <ToolButton
      icon="/commons/icons/undo.svg"
      label="元に戻す"
      :disabled="!canUndo"
      @click="emits('undo')"
    />
    <ToolButton
      icon="/commons/icons/redo.svg"
      label="やり直す"
      :disabled="!canRedo"
      @click="emits('redo')"
    />
    <div class="c-editor-topbar__sep" />
    <ToolRadioButtons
      v-model:selected="currentRatio"
      name="canvas_ratio"
      label="比率"
      :list="ratioList"
      @change="emits('change-ratio', currentRatio)"
    />
    <template v-if="currentRatio === 'custom'">
      <div class="c-editor-topbar__size">
        <span>W</span>
        <InputNumber
          v-model="canvasWidth"
          :min="1"
          :max="4000"
          mode="uint"
          @update:modelValue="emits('change-size')"
        />
      </div>
      <div class="c-editor-topbar__size">
        <span>H</span>
        <InputNumber
          v-model="canvasHeight"
          :min="1"
          :max="4000"
          mode="uint"
          @update:modelValue="emits('change-size')"
        />
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.c-editor-topbar {
  display: flex;
  align-items: center;
  background: white;
  border-bottom: 0.1rem solid black;
  min-height: 2rem;
  flex-shrink: 0;
  gap: 0.2rem;
  padding: 0.1rem 0.2rem;
  flex-wrap: wrap;

  &__sep {
    width: 0.1rem;
    height: 1.6rem;
    background: #ccc;
    margin: 0 0.2rem;
  }

  &__size {
    display: flex;
    align-items: center;
    gap: 0.2rem;
    border: 0.1rem solid black;
    padding: 0 0.4rem;
    height: 2rem;

    span {
      font-size: 0.75rem;
    }

    input {
      width: 4rem;
    }
  }
}
</style>
