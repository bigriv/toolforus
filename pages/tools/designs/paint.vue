<script setup lang="ts">
import PaintTool from "@/components/templates/tools/designs/PaintTool.vue";
import { useTOUHead } from "@/composables/common/head";

useTOUHead({
  title: "ペイント",
  description: "ブラシで自由に描けるペイントツールです。",
});
</script>

<template>
  <div class="c-tool">
    <PaintTool />
  </div>
</template>

<style scoped lang="scss">
.c-tool {
  min-width: 300px;
  min-height: 400px;
  width: 90vw;
  height: 90vh;
  margin: auto;
}
</style>
