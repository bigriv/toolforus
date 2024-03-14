<script setup lang="ts">
import { computed } from "vue";
import InputText from "@/components/atoms/interfaces/InputText.vue";

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0,
  },
  min: {
    type: Number,
    default: undefined,
  },
  max: {
    type: Number,
    default: undefined,
  },
  step: {
    type: Number,
    default: 1,
  },
  mode: {
    type: String as PropType<"float" | "int" | "ufloat" | "uint">,
    default: "float",
  },
});

const emits = defineEmits([
  "update:modelValue",
  "focus",
  "blur",
  "input",
  "change",
  "keypress",
]);

const modelValue = computed({
  get: () => props.modelValue,
  set: (newValue: Number) => emits("update:modelValue", newValue),
});

const getValue = (value: string) => {
  const num = Number(value);
  if (Number.isNaN(num)) {
    const replaced = value.replace(/\D+/g, "");
    return Number(replaced);
  }
  // 最小値チェック
  if (props.min && num <= props.min) {
    return props.min;
  }
  // 最大値チェック
  if (props.max && num >= props.max) {
    return props.max;
  }
  return num;
};
const onBlur = (event: Event) => {
  if (!(event instanceof FocusEvent)) {
    modelValue.value = 0;
    return;
  }
  if (!(event.target instanceof HTMLInputElement)) {
    modelValue.value = 0;
    return;
  }
  modelValue.value = getValue(event.target.value);
};
const onChange = (event: Event) => {
  if (!(event instanceof KeyboardEvent)) {
    return 0;
  }
  if (!(event.target instanceof HTMLInputElement)) {
    return 0;
  }

  switch (props.mode) {
    case "float":
      if (!/^[0-9\.\-]$/.test(event.key)) {
        return Number(event.target.value);
      }
      break;
    case "ufloat":
      if (!/^[0-9\.]$/.test(event.key)) {
        return Number(event.target.value);
      }
      break;
    case "int":
      if (!/^[0-9\-]$/.test(event.key)) {
        return Number(event.target.value);
      }
      break;
    case "uint":
      if (!/^[0-9]$/.test(event.key)) {
        return Number(event.target.value);
      }
      break;
  }
  return getValue(event.target.value + event.key);
};
const onKeydown = (event: Event) => {
  if (!(event instanceof KeyboardEvent)) {
    return 0;
  }
  if (!(event.target instanceof HTMLInputElement)) {
    return 0;
  }
  const value = getValue(event.target.value);
  let newValue = modelValue.value;
  switch (event.key) {
    case "ArrowUp":
      if (!props.max && props.max !== 0) {
        newValue = value + props.step;
        break;
      }
      if (value + props.step <= props.max) {
        newValue = value + props.step;
        break;
      }
      break;
    case "ArrowDown":
      if (!props.min && props.min !== 0) {
        newValue = value - props.step;
        break;
      }
      if (value - props.step >= props.min) {
        newValue = value - props.step;
        break;
      }
      break;
  }
  modelValue.value = Math.round(newValue * 1000) / 1000;
};
</script>

<template>
  <InputText
    mode="number"
    :num="modelValue"
    @change="onChange"
    @blur="onBlur"
    @keydown="onKeydown"
  />
</template>

<style scoped lang="scss">
input[type="text"] {
  text-align: right;
}
</style>
