<script setup lang="ts">
import BasicNote from "@/components/templates/tools/generals/BasicNote.vue";
import { useTOUHead } from "@/composables/common/head";

useTOUHead({
  title: "メモ帳",
  description: "シンプルにメモしましょう。保存可能。",
});
</script>

<template>
  <div class="c-note">
    <BasicNote />
  </div>
</template>

<style scoped lang="scss">
.c-note {
  max-width: 500px;
  height: 700px;
  margin: auto;
}
</style>
