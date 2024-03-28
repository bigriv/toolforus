<script setup lang="ts">
import { ref } from "vue";

const props = defineProps({
  content: {
    type: String,
    default: "",
  },
  timming: {
    type: String as PropType<"hover" | "click">,
    default: "hover",
  },
});

const isShowBalloon = ref(false);

const onClick = () => {
  if (props.timming !== "click") {
    return;
  }
  isShowBalloon.value = true;
  setTimeout(() => {
    isShowBalloon.value = false;
  }, 1000);
};
const onMouseEnter = () => {
  if (props.timming !== "hover") {
    return;
  }
  isShowBalloon.value = true;
};
const onMouseLeave = () => {
  if (props.timming !== "hover") {
    return;
  }
  isShowBalloon.value = false;
};
</script>
<template>
  <div
    class="c-wrap"
    @click="onClick"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <slot />
    <transition>
      <div v-show="isShowBalloon" class="c-wrap__balloon">
        {{ props.content }}
      </div>
    </transition>
  </div>
</template>

<style scoped lang="scss">
.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease-in;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
.c-wrap {
  position: relative;
  width: fit-content;

  &__balloon {
    position: absolute;
    top: 0;
    left: calc(100% + 1rem);
    padding: 0.4rem 0.8rem;
    background-color: gray;
    color: white;
    font-size: 1rem;
    white-space: pre;
    z-index: 1;
    &::before {
      content: "";
      position: absolute;
      top: 50%;
      left: 0;
      width: 1rem;
      height: 1rem;
      clip-path: polygon(0 50%, 100% 0, 100% 100%);
      background-color: gray;
      transform: translate(-100%, -50%);
    }
  }
}
</style>
