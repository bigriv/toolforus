<script setup lang="ts">
import ToolButton from "@/components/atoms/interfaces/ToolButton.vue";
import InputColorModal from "@/components/molecules/modals/InputColorModal.vue";
import { TOURGBColor } from "@/types/common/css/color";

const props = defineProps({
  color: {
    type: TOURGBColor,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  // 透明度の選択可否
  inputAlpha: {
    type: Boolean,
    default: true,
  },
});
const emits = defineEmits(["update:color", "submit"]);

const isShowModal = ref(false);
const color = computed({
  get: () => props.color,
  set: (newValue) => emits("update:color", newValue),
});

const onSubmitnColor = (newColor: TOURGBColor) => {
  color.value = newColor;
  emits("submit");
};
</script>

<template>
  <div
    class="c-input_color_tool_button"
    :style="{
      '--color': color.code,
      '--opacity': color.opacity,
    }"
  >
    <ToolButton @click="isShowModal = true">
      <img :src="props.icon" />
    </ToolButton>
    <InputColorModal
      v-model:isShowModal="isShowModal"
      :color="color"
      :inputOpacity="props.inputAlpha"
      class="c-input_color_tool_button__modal"
      @submit="onSubmitnColor"
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
