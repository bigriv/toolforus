<script setup lang="ts">
import { TOUIntroduction } from "@/types/others/introduction";

const props = defineProps({
  introduction: {
    type: TOUIntroduction,
    required: true,
  },
  depth: {
    type: Number,
    default: 0,
  },
});
</script>

<template>
  <div
    class="c-introduction"
    :style="{
      width: props.introduction.radius + '%',
      height: props.introduction.radius + '%',
      left: props.introduction.position.x - props.introduction.radius / 2 + '%',
      top: props.introduction.position.y - props.introduction.radius / 2 + '%',
      fontSize: props.introduction.fontSize + 'rem',
      'animation-delay': props.depth * 0.5 + 's',
    }"
  >
    <span>{{ props.introduction.name }}</span>
  </div>
  <Introduction
    v-for="child in props.introduction.children"
    :introduction="child"
    :depth="props.depth + 1"
  />
</template>

<style scoped lang="scss">
.c-introduction {
  position: absolute;
  border: 0.1rem solid #888;
  border-radius: 50%;
  background: white;
  font-family: "Klee One", sans-serif;
  box-shadow: 0.1rem 0.1rem 0.2rem black;
  animation: UnblurFadein 1s ease-out;
  animation-fill-mode: backwards;
  span {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    white-space: pre;
  }
}
</style>
