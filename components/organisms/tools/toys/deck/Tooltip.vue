<script setup lang="ts">
import type { PropType } from "vue";

const props = defineProps({
  isShow: {
    type: Boolean,
    required: true,
  },
  actions: {
    type: Object as PropType<
      {
        label: string;
        action: () => void;
      }[]
    >,
    default: () => [],
  },
  place: {
    type: String as PropType<"above" | "below" | "right" | "left">,
    default: "left",
  },
});

const emits = defineEmits(["update:isShow"]);

const isShow = computed({
  get: () => props.isShow,
  set: (newValue) => emits("update:isShow", newValue),
});

const onClose = () => {
  isShow.value = false;
};
</script>

<template>
  <div v-if="isShow" class="c-deck_tooltip" :class="`c-deck_tooltip--${place}`">
    <img
      src="/commons/icons/close.svg"
      class="c-deck_tooltip__close"
      @click="onClose"
    />
    <button
      v-for="(action, index) in props.actions"
      :key="index"
      @click="action.action"
    >
      {{ action.label }}
    </button>
  </div>
</template>

<style scoped lang="scss">
.c-deck_tooltip {
  z-index: 10;
  position: absolute;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  background: white;
  border: 2px solid black;
  border-radius: 5px;
  box-shadow: 2px 2px 8px black;
  &--above {
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    &::before {
      bottom: -20px;
      left: 50%;
      transform: translateX(-50%);
      clip-path: polygon(0 0, 100% 0, 50% 100%);
    }
    &::after {
      bottom: -16px;
      left: 50%;
      transform: translateX(-50%);
      clip-path: polygon(0 0, 100% 0, 50% 100%);
    }
  }
  &--below {
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    &::before {
      top: -20px;
      left: 50%;
      transform: translateX(-50%);
      clip-path: polygon(0 100%, 50% 0, 100% 100%);
    }
    &::after {
      top: -16px;
      left: 50%;
      transform: translateX(-50%);
      clip-path: polygon(0 100%, 50% 0, 100% 100%);
    }
  }
  &--left {
    top: 50%;
    right: 100%;
    transform: translateY(-50%);
    &::before {
      right: -20px;
      top: 50%;
      transform: translateY(-50%);
      clip-path: polygon(0 0, 100% 50%, 0 100%);
    }
    &::after {
      right: -16px;
      top: 50%;
      transform: translateY(-50%);
      clip-path: polygon(0 0, 100% 50%, 0 100%);
    }
  }
  &--right {
    top: 50%;
    left: 100%;
    transform: translateY(-50%);
    &::before {
      left: -20px;
      top: 50%;
      transform: translateY(-50%);
      clip-path: polygon(0 50%, 100% 0, 100% 100%);
    }
    &::after {
      left: -16px;
      top: 50%;
      transform: translateY(-50%);
      clip-path: polygon(0 50%, 100% 0, 100% 100%);
    }
  }
  &::before {
    content: "";
    position: absolute;
    width: 20px;
    height: 20px;
    background: black;
  }
  &::after {
    content: "";
    position: absolute;
    width: 16px;
    height: 16px;
    background: white;
  }
  &__close {
    cursor: pointer;
    position: absolute;
    top: 0;
    right: 0;
    opacity: 0.6;
    &:hover {
      opacity: 1;
    }
  }
  > button {
    cursor: pointer;
    padding: 5px;
    width: 160px;
    background: white;
    border: 1px solid black;
    border-radius: 10px;
    &:hover {
      background: #e0e0e0;
    }
  }
}
</style>
