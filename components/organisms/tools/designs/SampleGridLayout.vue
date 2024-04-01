<script setup lang="ts">
import { TOUGridLayout } from "@/types/tools/designs/colorsuggest/layout";

const props = defineProps({
  layout: {
    type: TOUGridLayout,
    required: true,
  },
});
</script>

<template>
  <div
    class="c-sample"
    :style="{
      '--col': props.layout.col,
      '--row': props.layout.row,
    }"
  >
    <div
      v-for="content in props.layout.components"
      class="c-sample__content"
      :style="[
        {
          '--startX': content.start.x + 1,
          '--startY': content.start.y + 1,
          '--endX': content.end.x + 1,
          '--endY': content.end.y + 1,
          background: content.background.rgba(),
        },
        content.font?.getStyle(),
        content.border?.getStyle(),
      ]"
    >
      <template v-if="content.text">{{ content.text }}</template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.c-sample {
  display: grid;
  width: 100%;
  height: 100%;
  grid-template-columns: repeat(var(--col), calc(100% / var(--col)));
  grid-template-rows: repeat(var(--row), calc(100% / var(--row)));
  &__content {
    width: 100%;
    height: 100%;
    grid-column: var(--startX) / var(--endX);
    grid-row: var(--startY) / var(--endY);
    transition:
      background 0.4s ease,
      opacity 0.4s ease;
  }
}
</style>
