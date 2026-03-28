<script setup lang="ts">
import ImageProcessingTool from "@/components/templates/tools/designs/ImageProcessingTool.vue";
import { useTOUHead } from "@/composables/common/head";

useTOUHead({
  title: "画像加工",
  description: "画像のフィルター調整やトリミング、背景透過などができるツールです。",
});
</script>

<template>
  <div class="c-tool">
    <ImageProcessingTool />
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
