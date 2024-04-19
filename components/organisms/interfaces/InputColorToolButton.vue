<script setup lang="ts">
import ToolButton from "@/components/atoms/interfaces/ToolButton.vue";
import InputColorModal from "@/components/molecules/modals/InputColorModal.vue";
import { TOUColor } from "@/types/common/color/color";

const props = defineProps({
  color: {
    type: TOUColor,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    default: "",
  },
  // 透明度の選択可否
  inputAlpha: {
    type: Boolean,
    default: true,
  },
});
const emits = defineEmits([
  "update:color",
  "open",
  "close",
  "cancel",
  "submit",
]);

const isShowModal = ref(false);
const color = computed({
  get: () => props.color,
  set: (newValue) => emits("update:color", newValue),
});

watch(
  () => isShowModal.value,
  () => {
    if (isShowModal.value) {
      emits("open");
    } else {
      emits("close");
    }
  }
);
const onSubmitnColor = (newColor: TOUColor) => {
  color.value = newColor;
  emits("submit");
};
const onCancel = () => {
  emits("cancel");
};
</script>

<template>
  <div
    class="c-input_color_tool_button"
    :style="{
      '--color': color.code,
      '--opacity': color.alpha,
    }"
  >
    <ToolButton
      :icon="props.icon"
      :label="props.label"
      @click="isShowModal = true"
    />
    <InputColorModal
      v-model:isShowModal="isShowModal"
      :color="color"
      :inputOpacity="props.inputAlpha"
      class="c-input_color_tool_button__modal"
      @submit="onSubmitnColor"
      @cancel="onCancel"
    />
  </div>
</template>

<style scoped lang="scss">
.c-input_color_tool_button {
  position: relative;
  &::after {
    content: "";
    position: absolute;
    top: 1.5rem;
    left: 50%;
    transform: translateX(-50%);
    background-color: var(--color);
    opacity: var(--opacity);
    width: 1em;
    height: 0.2rem;
  }
  &__modal {
    position: absolute;
    top: 0;
    left: 2.4rem;
  }
}
</style>
