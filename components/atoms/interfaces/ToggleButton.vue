<script setup lang="ts">
import { IdUtils } from "@/types/common/id";

const props = defineProps({
  label: {
    type: String,
    default: undefined,
  },
  modelValue: {
    type: Boolean,
    required: true,
  },
});
const emits = defineEmits(["update:modelValue"]);
const id = "toggle_button_" + IdUtils.generateUuid();
const modelValue = computed({
  get: () => props.modelValue,
  set: (newValue) => emits("update:modelValue", newValue),
});
</script>

<template>
  <div class="c-toggle_button">
    <span v-if="props.label">{{ props.label }}</span>
    <div class="c-toggle_button__main">
      <span>ON</span>
      <input v-model="modelValue" :id="id" type="checkbox" />
      <label :for="id" />
      <span>OFF</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.c-toggle_button {
  display: flex;
  align-items: center;
  gap: 0 0.8rem;
  &__main {
    display: flex;
    align-items: center;
    gap: 0 0.4rem;
    input[type="checkbox"] {
      appearance: none;
      -webkit-appearance: none;
      outline: none;
      background: transparent;
      + label {
        position: relative;
        width: 4.8rem;
        height: 2rem;
        border-radius: 2rem;
        background: #ddd;
        box-shadow: 0 0 0.2rem inset;
        display: block;
        cursor: pointer;
        transition: all 0.4s ease;
        &::before {
          content: "";
          position: absolute;
          top: 50%;
          right: 0;
          transform: translate(-20%, -50%);
          height: 80%;
          aspect-ratio: 1;
          border-radius: 100%;
          background: #a9a9a9;
          transition: all 0.6s ease;
        }
      }
      &:checked + label {
        background: #4169e1;
        &::before {
          right: 100%;
          background: #eee;
          transform: translate(120%, -50%);
        }
      }
    }
  }
}
</style>
