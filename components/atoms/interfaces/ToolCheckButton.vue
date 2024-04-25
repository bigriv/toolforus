<script setup lang="ts">
const props = defineProps({
  modelValue: { type: Boolean, required: true },
  icon: {
    type: String,
    default: undefined,
  },
  label: {
    type: String,
    default: "",
  },
});

const emits = defineEmits(["update:modelValue"]);

const isHover = ref(false);
const modelValue = computed({
  get: () => props.modelValue,
  set: (newValue) => emits("update:modelValue", newValue),
});
</script>

<template>
  <label
    class="c-tool_check_button"
    @mouseover="isHover = true"
    @mouseleave="isHover = false"
  >
    <input v-model="modelValue" type="checkbox" />
    <img :src="props.icon" :alt="props.label" />
    <Transition v-if="props.label">
      <span v-show="isHover" class="c-tool_check_button__label">
        {{ props.label }}
      </span>
    </Transition>
  </label>
</template>

<style scoped lang="scss">
.c-tool_check_button {
  position: relative;
  display: block;
  width: 2.4rem;
  height: 100%;
  background-color: white;
  border: 0.1rem solid black;
  cursor: pointer;
  img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
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
    background-color: #9999ff;
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
}
.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease-in;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
