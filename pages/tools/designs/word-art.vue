<script setup lang="ts">
import WordArtTool from "@/components/templates/tools/designs/WordArtTool.vue";
import { useTOUHead } from "@/composables/common/head";

useTOUHead({
  title: "ワードアート",
  description: "テキストをデザインして装飾できるワードアートツールです。",
});
</script>

<template>
  <div class="c-tool">
    <WordArtTool />
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
