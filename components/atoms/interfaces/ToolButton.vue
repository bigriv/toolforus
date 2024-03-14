<script setup lang="ts">
const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
});
const emits = defineEmits(["click"]);
const onClick = () => {
  emits("click");
};
</script>

<template>
  <button :disabled="props.disabled" @click="onClick">
    <slot />
  </button>
</template>

<style scoped lang="scss">
button {
  position: relative;
  display: block;
  width: 2.4rem;
  height: 100%;
  background: white;
  border: 0.1rem solid black;
  cursor: pointer;
  > * {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
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
</style>
