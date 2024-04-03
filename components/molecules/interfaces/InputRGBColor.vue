<script setup lang="ts">
import { computed, ref, watch } from "vue";
import InputText from "@/components/atoms/interfaces/InputText.vue";
import InputSlideAndNumber from "@/components/molecules/interfaces/InputSlideAndNumber.vue";
import { TOURGBColor } from "@/types/common/css/color";

const props = defineProps({
  color: {
    type: TOURGBColor,
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
  red: props.color.getRed(),
  green: props.color.getGreen(),
  blue: props.color.getBlue(),
  opacity: props.color.opacity * 100,
});
watch(
  () => props.color,
  () => {
    input.value.red = props.color.getRed();
    input.value.green = props.color.getGreen();
    input.value.blue = props.color.getBlue();
    input.value.opacity = Math.round(props.color.opacity * 100);
  }
);
watch(
  () => input.value,
  () => {
    emits(
      "update:color",
      new TOURGBColor(
        TOURGBColor.numberToCode(
          input.value.red,
          input.value.green,
          input.value.blue
        ),
        input.value.opacity / 100
      )
    );
  },
  { deep: true }
);
const color = computed(() => props.color.rgba());
const onChangeCode = (event: Event) => {
  const text = (event.target as HTMLInputElement).value;
  if (!TOURGBColor.CODE_FORMAT.test(text)) {
    return;
  }
  const newColor = new TOURGBColor(text, props.color.opacity);
  input.value.red = newColor.getRed();
  input.value.green = newColor.getGreen();
  input.value.blue = newColor.getBlue();
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
