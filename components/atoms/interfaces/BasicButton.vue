<script setup lang="ts">
import { TOUColor } from "@/types/common/color/color";

const props = defineProps({
  label: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  bgColor: {
    type: TOUColor,
    default: new TOUColor(TOUColor.CODE_WHITE),
  },
});

const emits = defineEmits(["click"]);

const bgColor = computed(() => props.bgColor.getRGBA());
const onClick = () => {
  emits("click");
};
</script>

<template>
  <button
    :disabled="props.disabled"
    :style="{ background: bgColor }"
    @click="onClick"
  >
    {{ props.label }}
  </button>
</template>

<style scoped lang="scss">
button {
  height: 100%;
  width: 100%;
  border: solid 0.1rem black;
  padding: 0.4rem 0.4rem;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
  &:active {
    opacity: 1;
  }
  &:disabled {
    background-color: #ddd !important;
    cursor: not-allowed;
    &:hover {
      background-color: #ddd;
    }
  }
}
</style>
