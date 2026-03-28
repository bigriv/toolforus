<script setup lang="ts">
import DesignsIntegraterTool from "@/components/templates/tools/designs/DesignsIntegraterTool.vue";
import { useTOUHead } from "@/composables/common/head";

useTOUHead({
  title: "デザイン統合",
  description: "ペイント・図形描画・画像加工・ワードアートを1つのキャンバスで統合編集できます。",
});
</script>

<template>
  <div class="c-integrater">
    <DesignsIntegraterTool />
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
