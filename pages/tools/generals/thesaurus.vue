<script setup lang="ts">
import Thesaurus from "@/components/templates/tools/generals/Thesaurus.vue";
import { useTOUHead } from "@/composables/common/head";

useTOUHead({
  title: "類語ゲッター",
  description: "あなたの求める類語を見つけます。",
});
</script>

<template>
  <Thesaurus />
</template>
