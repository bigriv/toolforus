<script setup lang="ts">
import Introduction from "@/components/atoms/Introduction.vue";
import { TOUPosition } from "@/types/common/position";
import { TOUIntroduction } from "@/types/others/introduction";

const tree = new TOUIntroduction("創造", new TOUPosition(50, 50), 15, 1.4, [
  new TOUIntroduction("デザイン", new TOUPosition(20, 12.5), 25, 1.2, [
    new TOUIntroduction("配色", new TOUPosition(7.5, 30), 15, 1.4),
  ]),
  new TOUIntroduction("日常", new TOUPosition(70, 88), 12, 1, [
    new TOUIntroduction("記録", new TOUPosition(95, 60), 10, 0.8),
  ]),
]);
</script>

<template>
  <div class="c-introduction">
    <Introduction :introduction="tree" />
  </div>
</template>

<style scoped lang="scss">
.c-introduction {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
}
</style>
