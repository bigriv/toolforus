<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
});
const emits = defineEmits(["update:modelValue", "change"]);

const modelValue = computed({
  get: () => props.modelValue,
  set: (newValue) => emits("update:modelValue", newValue),
});

const onChange = (event: Event) => {
  emits("change", event);
};
</script>

<template>
  <label @change="onChange">
    <input type="checkbox" v-model="modelValue" />
    <span>{{ props.label }}</span>
  </label>
</template>

<style scoped lang="scss">
label {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  padding-left: 1rem;
  line-height: 1.2;
  cursor: pointer;
  user-select: none;
  &::before {
    content: "";
    position: absolute;
    width: 0.4rem;
    height: 0.4rem;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    border: 0.1rem solid black;
  }
  &::after {
    content: "";
    position: absolute;
    width: 0.4rem;
    height: 0.6rem;
    top: 50%;
    left: 0;
    transform: translate(-75%, -75%);
    border-bottom: 0rem solid black;
    border-right: 0rem solid black;
    opacity: 0;
    rotate: 45deg;
    transition: all 0.2s ease-in-out;
  }
  &:hover {
    background-color: #eee;
  }
  input[type="checkbox"] {
    appearance: none;
    display: none;
    width: 2.4rem;
    height: 100%;
  }
  &:has(input[type="checkbox"]:checked) {
    &::after {
      opacity: 1;
      border-bottom: 0.2rem solid black;
      border-right: 0.2rem solid black;
    }
  }
}
</style>
