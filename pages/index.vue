<script setup lang="ts">
import LinkCardList from "@/components/atoms/lists/LinkCardList.vue";

const contents = [
  {
    title: "ストップウォッチ",
    path: "/tools/generals/stopwatch/custom",
  },
  {
    title: "メモ帳",
    path: "/tools/generals/note",
  },
  {
    title: "手書きメモ",
    path: "/tools/generals/freehand",
  },
  {
    title: "翻訳機",
    path: "/tools/generals/translate",
  },
  {
    title: "アイデアマップ",
    path: "/tools/generals/ideamap",
  },
  {
    title: "統合",
    path: "/tools/generals/integrater",
  },
  {
    title: "カラーコンパニオン",
    path: "/tools/designs/colorcompanion",
  },
  {
    title: "色検索",
    path: "/tools/designs/colorsearcher",
  },
  {
    title: "簡易画像編集",
    path: "/tools/designs/iie",
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
