<script setup lang="ts">
const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: "",
  },
  icon: {
    type: String,
    required: true,
  },
  color: {
    type: String as PropType<"black" | "red">,
    default: "black",
  },
});
const emits = defineEmits(["click"]);

const isHover = ref(false);
const onClick = () => {
  emits("click");
};
</script>

<template>
  <button
    :disabled="props.disabled"
    class="c-tool_button"
    @mouseover="isHover = true"
    @mouseleave="isHover = false"
    @click="onClick"
  >
    <img
      :src="props.icon"
      :alt="props.label"
      :class="{
        'u-icon--red': props.color === 'red',
      }"
    />
    <Transition v-if="props.label">
      <span v-show="isHover" class="c-tool_button__label">
        {{ props.label }}
      </span>
    </Transition>
    <slot />
  </button>
</template>

<style scoped lang="scss">
.c-tool_button {
  position: relative;
  display: block;
  width: 2.4rem;
  height: 2rem;
  background: white;
  border: 0.1rem solid black;
  cursor: pointer;
  img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  &__label {
    position: absolute;
    top: 50%;
    left: calc(100% + 1rem);
    padding: 0.4rem 0.8rem;
    background-color: white;
    color: black;
    border: 0.1rem solid black;
    font-size: 0.8rem;
    white-space: pre;
    z-index: 1;
    transform: translateY(-50%);
  }
  &:hover {
    background-color: #eee;
  }
  &:disabled {
    background-color: #ddd;
    cursor: not-allowed;
    &:hover {
      background-color: #ddd;
    }
  }
}
.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease-in;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
.u-icon--red {
  filter: invert(15%) sepia(95%) saturate(6932%) hue-rotate(358deg)
    brightness(95%) contrast(112%);
}
</style>
