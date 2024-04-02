<script setup lang="ts">
import { TOURGBColor } from "@/types/common/css/color";

const props = defineProps({
  color: {
    type: TOURGBColor,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});
const emits = defineEmits(["click"]);

const color = computed(() => props.color.rgba());
const onClickButton = () => {
  emits("click");
};
</script>

<template>
  <button
    :disabled="props.disabled"
    :style="{ '--color': color }"
    class="c-color_button"
    @click="onClickButton"
  ></button>
</template>

<style scoped lang="scss">
.c-color_button {
  display: block;
  position: relative;
  width: 100%;
  height: 100%;
  cursor: pointer;
  background-color: white;
  border: 0.1rem solid black;
  border-radius: 10%;
  &::before {
    content: "";
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: var(--color);
    border: solid #fff;
    border-width: 0.2rem 0.2rem;
  }
}
</style>
