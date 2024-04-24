<script setup lang="ts" generic="T">
import { IdUtils } from "@/types/common/id";

const id = IdUtils.generateUuid();

type SelectOption = {
  label: string;
  value: T;
};
const props = withDefaults(
  defineProps<{
    modelValue: T;
    options: SelectOption[];
    disabled?: boolean;
  }>(),
  {
    disabled: false,
  }
);
const emits = defineEmits(["update:modelValue"]);

const modelValue = computed({
  get: () => props.modelValue,
  set: (newValue) => emits("update:modelValue", newValue),
});
</script>

<template>
  <select v-model="modelValue">
    <option
      v-for="option in options"
      :key="`${id}_${option.value}`"
      :value="option.value"
    >
      {{ option.label }}
    </option>
  </select>
</template>

<style scoped lang="scss">
select {
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
