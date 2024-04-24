<script setup lang="ts">
import ColorSearcher from "@/components/templates/tools/designs/ColorSearcher.vue";
import ColorCompanion from "@/components/templates/tools/designs/ColorCompanion.vue";
import MoveTop from "@/components/atoms/interfaces/MoveTop.vue";
import { useTOUHead } from "@/composables/common/head";

useTOUHead({
  title: "色検索",
  description: "イメージから色を検索してみましょう。",
});

const isShowScheme = ref(false);
</script>

<template>
  <div class="c-color_searcher">
    <ColorSearcher />
    <div
      class="c-color_searcher__expand u-mgt-4"
      @click="isShowScheme = !isShowScheme"
    >
      <span data-is_show="false" v-if="!isShowScheme">
        配色のサンプルを見てみる
      </span>
      <span data-is_show="true" v-else> 配色のサンプルを非表示にする </span>
    </div>
    <Transition>
      <div
        v-show="isShowScheme"
        class="c-color_searcher__color_companion u-mgt-1"
      >
        <ColorCompanion />
      </div>
    </Transition>
  </div>
  <MoveTop />
</template>

<style scoped lang="scss">
.c-color_searcher {
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
  &__color_companion {
    display: grid;
    grid-template-rows: 1fr;
    > * {
      overflow: hidden;
    }
  }
}
.v-enter-active {
  transition: all 1s ease-out;
}
.v-leave-active {
  transition: all 0.3s ease-out;
}
.v-enter-from,
.v-leave-to {
  grid-template-rows: 0fr;
}
</style>
