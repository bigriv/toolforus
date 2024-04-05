<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  mode: {
    type: String as PropType<"string" | "number">,
    default: "string",
  },
  text: {
    type: String,
    default: "",
  },
  num: {
    type: Number,
    default: 0,
  },
  maxlength: {
    type: Number,
    default: undefined,
  },
  placeholder: {
    type: String,
    default: undefined,
  },
});

const emits = defineEmits([
  "update:text",
  "update:num",
  "focus",
  "blur",
  "input",
  "change",
  "keydown",
]);

const text = computed({
  get: () => props.text,
  set: (newValue) => emits("update:text", newValue),
});
const num = computed({
  get: () => props.num,
  set: (newValue) => emits("update:num", newValue),
});

const onFocus = (event: Event) => {
  emits("focus", event);
};
const onBlur = (event: Event) => {
  emits("blur", event);
};
const onInput = (event: Event) => {
  emits("input", event);
};
const onChange = (event: Event) => {
  emits("change", event);
};
const onKeydown = (event: Event) => {
  emits("keydown", event);
};
</script>

<template>
  <input
    v-if="props.mode === 'string'"
    v-model="text"
    type="text"
    :maxlength="props.maxlength"
    :placeholder="props.placeholder"
    @focus="onFocus"
    @blur="onBlur"
    @input="onInput"
    @change="onChange"
    @keydown="onKeydown"
  />
  <input
    v-else-if="props.mode === 'number'"
    v-model="num"
    type="text"
    @focus="onFocus"
    @blur="onBlur"
    @input="onInput"
    @change="onChange"
    @keydown="onKeydown"
  />
</template>

<style scoped lang="scss">
input[type="text"] {
  cursor: text;
  height: 100%;
  width: 100%;
  padding: 0.2rem;
  font-size: 100%;
  &:focus {
    outline: 0;
  }
}
</style>
