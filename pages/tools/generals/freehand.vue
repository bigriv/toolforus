<script setup lang="ts">
import FreehandNote from "@/components/templates/tools/generals/FreehandNote.vue";
import { useTOUHead } from "@/composables/common/head";

useTOUHead({
  title: "手書きメモ",
  description: "手書きでメモしましょう。",
});
</script>

<template>
  <div class="c-freehand">
    <FreehandNote />
  </div>
</template>

<style scoped lang="scss">
.c-freehand {
  max-width: 500px;
  height: 700px;
  margin: auto;
}
</style>
