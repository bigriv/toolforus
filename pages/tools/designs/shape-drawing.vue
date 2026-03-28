<script setup lang="ts">
import ShapeDrawingTool from "@/components/templates/tools/designs/ShapeDrawingTool.vue";
import { useTOUHead } from "@/composables/common/head";

useTOUHead({
  title: "図形描画",
  description: "さまざまな図形を描画できるツールです。",
});
</script>

<template>
  <div class="c-tool">
    <ShapeDrawingTool />
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
