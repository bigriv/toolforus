<script setup lang="ts">
import LinkCardList from '@/components/atoms/lists/LinkCardList.vue';

const contents = [
  {
    title: "ストップウォッチ",
    path: "/generals/stopwatch/custom",
  },
  {
    title: "メモ帳",
    path: "/generals/note",
  },
  {
    title: "手書きメモ",
    path: "/generals/freehand",
  },
  {
    title: "翻訳機",
    path: "/generals/translate",
  },
  {
    title: "アイデアマップ",
    path: "/generals/ideamap",
  },
  {
    title: "統合",
    path: "/generals/integrater/custom",
  },
];
</script>

<template>
  <div class="c-contents">
    <LinkCardList :contents="contents">
      <template v-slot:default="slotProps">
        <div class="c-contents__card">
          <div class="c-contents__card__title">
            {{ slotProps.content.title }}
          </div>
        </div>
      </template>
    </LinkCardList>
  </div>
</template>

<style scoped lang="scss">
.c-contents {
  &__card {
    padding: 0.4rem;
    &__title {
      font-size: 1rem;
      font-weight: bold;
    }
  }
}
</style>
