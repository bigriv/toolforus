<script setup lang="ts">
import InputSlider from "@/components/atoms/interfaces/InputSlider.vue";
import InputNumber from "@/components/molecules/interfaces/InputNumber.vue";

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
  sliderBackground: {
    type: String,
    default: undefined,
  },
});
const emits = defineEmits(["update:modelValue"]);

const modelValue = computed({
  get: () => props.modelValue,
  set: (newValue) => emits("update:modelValue", newValue),
});
</script>

<template>
  <div class="c-input_slider_and_number">
    <InputSlider
      v-model="modelValue"
      :max="props.max"
      :min="props.min"
      :background="props.sliderBackground"
    />
    <InputNumber v-model="modelValue" :max="props.max" :min="props.min" />
  </div>
</template>

<style scoped lang="scss">
.c-input_slider_and_number {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 0 0.4rem;
  height: 1.2rem;
  font-size: 0.9rem;
  input[type="text"] {
    width: 5rem;
    text-align: right;
  }
}
</style>
