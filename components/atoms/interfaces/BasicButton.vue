<script setup lang="ts">
const props = defineProps({
  label: {
    type: String,
    default: "",
  },
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
  <button :disabled="props.disabled" @click="onClick">{{ props.label }}</button>
</template>

<style scoped lang="scss">
button {
  height: 100%;
  width: 100%;
  background: white;
  border: solid 0.1rem black;
  padding: 0.4rem 0.4rem;
  cursor: pointer;
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
