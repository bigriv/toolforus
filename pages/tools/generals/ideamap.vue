<script setup lang="ts">
import IdeaMap from "@/components/templates/tools/generals/IdeaMap.vue";
import { useTOUHead } from "@/composables/common/head";

useTOUHead({
  title: "アイデアマップ",
  description: "単語の連想を広げて新しいアイデアを出しましょう。保存可能。",
});
</script>

<template>
  <div class="c-ideamap">
    <IdeaMap />
  </div>
</template>

<style scoped lang="scss">
.c-ideamap {
  width: 100%;
  height: 700px;
  margin: auto;
}
</style>
