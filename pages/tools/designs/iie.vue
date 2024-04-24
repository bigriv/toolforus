<script setup lang="ts">
import InstantImageEditer from "@/components/templates/tools/designs/InstantImageEditer.vue";
import { useTOUHead } from "@/composables/common/head";

useTOUHead({
  title: "簡易画像編集",
  description: "簡単な画像編集をやってみましょう。",
});
</script>

<template>
  <div class="c-iie">
    <InstantImageEditer />
  </div>
</template>

<style scoped lang="scss">
.c-iie {
  min-width: 300px;
  min-height: 400px;
  width: 90vw;
  height: 90vh;
  margin: auto;
}
</style>
