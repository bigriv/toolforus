<script setup lang="ts">
import InputNumber from "@/components/molecules/interfaces/InputNumber.vue";

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
  label: {
    type: String,
    default: "",
  },
  icon: {
    type: String,
    required: true,
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

const isHover = ref(false);
const modelValue = computed({
  get: () => props.modelValue,
  set: (newValue) => emits("update:modelValue", newValue),
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
const onKeypress = (event: Event) => {
  emits("keypress", event, modelValue.value);
};
</script>

<template>
  <div
    class="c-tool_input_number"
    @mouseover="isHover = true"
    @mouseleave="isHover = false"
  >
    <img :src="props.icon" :alt="props.label" />
    <div class="c-tool_input_number__input">
      <InputNumber
        v-model="modelValue"
        :min="props.min"
        :max="props.max"
        :mode="props.mode"
        :step="props.step"
        @focus="onFocus"
        @blur="onBlur"
        @input="onInput"
        @change="onChange"
        @keypress="onKeypress"
      />
    </div>
    <Transition v-if="props.label">
      <span v-show="isHover" class="c-tool_input_number__label">
        {{ props.label }}
      </span>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.c-tool_input_number {
  position: relative;
  display: flex;
  align-items: center;
  height: 100%;
  width: 6rem;
  border: 0.1rem solid black;
  padding: 0rem 0.4rem;
  gap: 0 0.4rem;
  &__input {
    height: 80%;
    width: 3em;
  }
  &__label {
    position: absolute;
    top: 50%;
    left: calc(100% + 1rem);
    padding: 0.4rem 0.8rem;
    background-color: white;
    color: black;
    border: 0.1rem solid black;
    font-size: 1rem;
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
