<script setup lang="ts">
import type { PropType } from "vue";
import { TOUColor } from "@/types/common/color/color";

const props = defineProps({
  balances: {
    type: Array<{
      color: TOUColor;
      rate: Number;
    }>,
    default: () => [],
  },
  direction: {
    type: String as PropType<"vertical" | "horizontal">,
    default: "vertical",
  },
});
</script>

<template>
  <div class="c-color_balance" :class="`c-color_balance--${props.direction}`">
    <div
      v-for="balance in props.balances"
      class="c-color_balance__color"
      :style="{
        background: balance.color.getRGBA(),
        '--rate': `${balance.rate}`,
      }"
    ></div>
  </div>
</template>

<style scoped lang="scss">
.c-color_balance {
  display: flex;
  border: 0.1rem lightgray solid;
}
.c-color_balance--vertical {
  width: 3.2rem;
  height: 8rem;
  flex-direction: column;
  justify-content: flex-end;
  .c-color_balance__color {
    width: 100%;
    height: calc(var(--rate) * 1%);
  }
}
.c-color_balance--horizontal {
  width: 8rem;
  height: 3.2rem;
  flex-direction: row;
  justify-content: flex-start;
  .c-color_balance__color {
    width: calc(var(--rate) * 1%);
    height: 100%;
  }
}
</style>
