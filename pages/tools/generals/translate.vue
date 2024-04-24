<script setup lang="ts">
import Translate from "@/components/templates/tools/generals/Translate.vue";
import { useTOUHead } from "@/composables/common/head";

useTOUHead({
  title: "翻訳機",
  description: "いくつかの言語を翻訳できます。",
});
</script>

<template>
  <div class="c-translate">
    <Translate />
  </div>
</template>

<style scoped lang="scss">
.c-translate {
  max-width: 1000px;
  margin: auto;
}
</style>
