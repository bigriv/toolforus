<script setup lang="ts">
import ColorCompanion from "@/components/templates/tools/designs/ColorCompanion.vue";
import ColorSearcher from "@/components/templates/tools/designs/ColorSearcher.vue";
import MoveTop from "@/components/atoms/interfaces/MoveTop.vue";
import { useTOUHead } from "@/composables/common/head";

useTOUHead({
  title: "カラーコンパニオン",
  description: "良い色の組み合わせを見つけてみましょう。",
});

const isShowSearch = ref(false);
</script>

<template>
  <div class="c-color_companion">
    <div
      class="c-color_companion__expand"
      @click="isShowSearch = !isShowSearch"
    >
      <span data-is_show="false" v-if="!isShowSearch"> 色を検索する </span>
      <span data-is_show="true" v-else> 色の検索を非表示にする </span>
    </div>
    <Transition>
      <div
        v-show="isShowSearch"
        class="c-color_companion__color_searcher u-mgt-1"
      >
        <ColorSearcher />
      </div>
    </Transition>
    <ColorCompanion class="u-mgt-4" />
  </div>
  <MoveTop />
</template>

<style scoped lang="scss">
.c-color_companion {
  width: 100%;
  height: 100%;
  max-width: 600px;
  margin: auto;
  &__expand {
    position: relative;
    width: fit-content;
    color: -webkit-link;
    cursor: pointer;
    text-decoration: underline;
    padding-left: 1.2em;
    &:hover {
      opacity: 0.6;
    }
    &::before {
      content: "▶";
      position: absolute;
      left: 0;
      transition: rotate 0.2s ease-in-out;
    }
    &:has(span[data-is_show="true"]) {
      &::before {
        rotate: 90deg;
      }
    }
    &:has(span[data-is_show="false"]) {
      &::before {
        rotate: 0deg;
      }
    }
  }
  &__color_searcher {
    display: grid;
    grid-template-rows: 1fr;
    > * {
      overflow: hidden;
    }
  }
}
.v-enter-active {
  transition: all 0.2s ease-out;
}
.v-leave-active {
  transition: all 0.3s ease-out;
}
.v-enter-from,
.v-leave-to {
  grid-template-rows: 0fr;
}
</style>
