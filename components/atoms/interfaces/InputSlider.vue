<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: Number,
    required: true,
  },
  max: {
    type: Number,
    default: 100,
  },
  min: {
    type: Number,
    default: 0,
  },
  background: {
    type: String,
    default: "#eee",
  },
});
const emits = defineEmits(["update:modelValue"]);

const modelValue = computed({
  get: () => props.modelValue,
  set: (newValue) => emits("update:modelValue", Math.round(newValue)),
});
</script>

<template>
  <input
    v-model.number="modelValue"
    type="range"
    :max="props.max"
    :min="props.min"
    :style="{ '--background': props.background }"
  />
</template>

<style scoped lang="scss">
input[type="range"] {
  appearance: none;
  -webkit-appearance: none;
  outline: none;
  background: transparent;
  width: 12rem;
  height: 1rem;
  &:hover {
    cursor: grab;
  }
  &:active {
    cursor: grabbing;
  }
  &::-webkit-slider-runnable-track {
    height: 0.8rem;
    border-radius: 0.8rem;
    border: 0.1rem lightgray solid;
    background: var(--background);
  }
  &::-moz-range-track {
    height: 0.8rem;
    border-radius: 0.8rem;
    border: 0.1rem lightgray solid;
    background: var(--background);
  }
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    height: 1rem;
    width: 1rem;
    background-color: #4cabe2;
    border-radius: 50%;
    border: 0.1rem lightgray solid;
    margin-top: -0.15rem; // (trackのheight - thumbのheight) / 2
  }
  &::-moz-range-thumb {
    -webkit-appearance: none;
    appearance: none;
    height: 1rem;
    width: 1rem;
    background-color: #4cabe2;
    border-radius: 50%;
    border: 0.1rem lightgray solid;
    margin-top: -0.15rem; // (trackのheight - thumbのheight) / 2
  }
}
</style>
