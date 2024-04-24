<script setup lang="ts">
import Integrater from "@/components/templates/tools/generals/Integrater.vue";
import { useTOUHead } from "@/composables/common/head";

useTOUHead({
  title: "統合",
  description: "全てのツールを一画面で管理しましょう。保存可能。",
});
</script>

<template>
  <div class="c-integrater">
    <Integrater />
  </div>
</template>

<style scoped lang="scss">
.c-integrater {
  min-width: 300px;
  min-height: 400px;
  width: 90vw;
  height: 90vh;
  margin: auto;
}
</style>
