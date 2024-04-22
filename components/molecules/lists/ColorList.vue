<script setup lang="ts">
import CopyIcon from "@/components/molecules/icons/CopyIcon.vue";
import type { TOUColor } from "@/types/common/color/color";

const props = defineProps({
  colors: {
    type: Array<TOUColor>,
    default: () => [],
  },
  row: {
    type: Number,
    default: undefined,
  },
});
</script>

<template>
  <div class="c-color_list" :style="{ '--row': props.row }">
    <div v-for="color in props.colors" class="c-color_list__color">
      <i
        :style="{
          background: color.code,
          opacity: color.alpha,
        }"
      />
      <div class="c-color_list__color__detail">
        <div class="c-color_list__color__detail__code">
          16進数: {{ color.code }}
          <div class="c-color_list__color__detail__copy">
            <CopyIcon :content="color.code" />
          </div>
        </div>
        <div class="c-color_list__color__detail__rgb">
          RGB: {{ color.rgb.red }}, {{ color.rgb.green }},
          {{ color.rgb.blue }}
        </div>
        <div class="c-color_list__color__detail__opacity">
          不透明度: {{ color.alpha * 100 }}%
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.c-color_list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  width: 100%;
  max-width: calc(var(--row) * 8.8rem);
  &__color {
    position: relative;
    i {
      display: block;
      width: 8rem;
      height: 8rem;
      border: 0.1rem lightgray solid;
      transition:
        background 0.4s ease,
        opacity 0.4s ease;
    }
    &__detail {
      font-size: 0.8rem;
      &__code {
        display: flex;
        align-items: center;
      }
      &__copy {
        width: 1.4em;
        height: 1.4em;
      }
    }
  }
}
</style>
