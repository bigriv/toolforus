<script setup lang="ts">
import { computed, ref, watch } from "vue";
import InputText from "@/components/atoms/interfaces/InputText.vue";
import InputSlideAndNumber from "@/components/molecules/interfaces/InputSlideAndNumber.vue";
import { TOUColor, TOURGBColor } from "@/types/common/color/color";

const props = defineProps({
  color: {
    type: TOUColor,
    required: true,
  },
  // 透明度の選択可否
  inputOpacity: {
    type: Boolean,
    default: true,
  },
});

const emits = defineEmits(["update:color"]);

const input = ref({
  red: props.color.rgb.red,
  green: props.color.rgb.green,
  blue: props.color.rgb.blue,
  opacity: props.color.alpha * 100,
});
watch(
  () => props.color,
  () => {
    input.value.red = props.color.rgb.red;
    input.value.green = props.color.rgb.green;
    input.value.blue = props.color.rgb.blue;
    input.value.opacity = Math.round(props.color.alpha * 100);
  }
);
watch(
  () => input.value,
  () => {
    const code = TOURGBColor.numberToCode(
      input.value.red,
      input.value.green,
      input.value.blue
    );
    const color = new TOUColor(code, input.value.opacity / 100);
    emits("update:color", color);
  },
  { deep: true }
);
const color = computed(() => props.color.getRGBA());
const onChangeCode = (event: Event) => {
  const text = (event.target as HTMLInputElement).value;
  if (!TOUColor.CODE_FORMAT.test(text)) {
    return;
  }
  const newColor = new TOUColor(text, props.color.alpha);
  input.value.red = newColor.rgb.red;
  input.value.green = newColor.rgb.green;
  input.value.blue = newColor.rgb.blue;
};
</script>

<template>
  <div class="c-input_color">
    <i class="c-input_color__display" :style="{ background: color }" />
    <div class="c-input_color__forms">
      <div class="c-input_color__forms__inputs">
        <div>16進数</div>
        <InputText
          :text="props.color.code"
          :maxlength="7"
          @blur="onChangeCode"
        />
      </div>
      <div class="c-input_color__forms__inputs">
        <InputSlideAndNumber
          v-model="input.red"
          :max="255"
          :min="0"
          sliderBackground="linear-gradient(to right, #fff, #ff0000)"
        />
      </div>
      <div class="c-input_color__forms__inputs">
        <InputSlideAndNumber
          v-model="input.green"
          :max="255"
          :min="0"
          sliderBackground="linear-gradient(to right, #fff, #00ff00)"
        />
      </div>
      <div class="c-input_color__forms__inputs">
        <InputSlideAndNumber
          v-model="input.blue"
          :max="255"
          :min="0"
          sliderBackground="linear-gradient(to right, #fff, #0000ff)"
        />
      </div>
      <template v-if="inputOpacity">
        <div class="c-input_color__forms__inputs">
          <InputSlideAndNumber
            v-model="input.opacity"
            :max="100"
            :min="0"
            sliderBackground="linear-gradient(to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1))"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.c-input_color {
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
  &__display {
    display: block;
    min-width: 8rem;
    min-height: 8rem;
    border: 0.1rem lightgray solid;
    transition:
      background 0.4s ease,
      opacity 0.4s ease;
  }
  &__forms {
    display: flex;
    flex-direction: column;
    gap: 0.4rem 0;
    font-size: 0.9rem;
    &__inputs {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      gap: 0 0.4rem;
      height: 1.2rem;
    }
    input[type="text"] {
      width: 5rem;
      text-align: right;
    }
  }
}
</style>
