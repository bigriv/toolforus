<script setup lang="ts">
import { computed, ref, watch } from "vue";
import InputNumber from "@/components/molecules/interfaces/InputNumber.vue";
import InputText from "@/components/atoms/interfaces/InputText.vue";
import { TOUHSBColor, TOURGBColor } from "@/types/common/css/color";

const props = defineProps({
  color: {
    type: TOURGBColor,
    required: true,
  },
  // 透明度の選択可否
  pickableAlpha: {
    type: Boolean,
    default: true,
  },
});

const emits = defineEmits(["update:color"]);

const hsb = props.color.hsba();
const input = ref({
  hue: hsb.hue,
  saturation: hsb.saturation * 100,
  brightness: hsb.brightness * 100,
  alpha: hsb.alpha * 100,
});
watch(
  () => props.color,
  () => {
    const hsb = props.color.hsba();
    input.value.hue = hsb.hue;
    input.value.saturation = Math.round(hsb.saturation * 100);
    input.value.brightness = Math.round(hsb.brightness * 100);
    input.value.alpha = Math.round(hsb.alpha * 100);
  }
);
watch(
  () => input.value,
  () => {
    const hsb = new TOUHSBColor(
      input.value.hue,
      input.value.saturation / 100,
      input.value.brightness / 100,
      input.value.alpha / 100
    );
    emits("update:color", hsb.rgba());
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
  const hsb = newColor.hsba();
  input.value.hue = hsb.hue;
  input.value.saturation = hsb.saturation * 100;
  input.value.brightness = hsb.brightness * 100;
};
</script>

<template>
  <div class="c-color_picker">
    <i class="c-color_picker__display" :style="{ background: color }" />
    <div class="c-color_picker__forms">
      <div class="c-color_picker__forms__inputs">
        <div>16進数</div>
        <InputText
          :text="props.color.code"
          :maxlength="7"
          @blur="onChangeCode"
        />
      </div>
      <div class="c-color_picker__forms__inputs">
        <input
          v-model.number="input.hue"
          type="range"
          :max="359"
          :min="0"
          class="c-color_picker__forms__inputs__slider--hue"
        />
        <InputNumber v-model="input.hue" :max="359" :min="0" />
      </div>
      <div class="c-color_picker__forms__inputs">
        <input
          v-model.number="input.saturation"
          type="range"
          :max="100"
          :min="0"
          class="c-color_picker__forms__inputs__slider--saturation"
          :style="{ '--hue': input.hue }"
        />
        <InputNumber v-model="input.saturation" :max="100" :min="0" />
      </div>
      <div class="c-color_picker__forms__inputs">
        <input
          v-model.number="input.brightness"
          type="range"
          :max="100"
          :min="0"
          class="c-color_picker__forms__inputs__slider--brightness"
        />
        <InputNumber v-model="input.brightness" :max="100" :min="0" />
      </div>
      <template v-if="pickableAlpha">
        <div class="c-color_picker__forms__inputs">
          <input
            v-model.number="input.alpha"
            type="range"
            :max="100"
            :min="0"
            class="c-color_picker__forms__inputs__slider--alpha"
          />
          <InputNumber v-model="input.alpha" :max="100" :min="0" />
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.c-color_picker {
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
  &__display {
    display: block;
    min-width: 8rem;
    min-height: 8rem;
    border: 0.1rem lightgray solid;
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
      &__slider {
        &--hue {
          &::-webkit-slider-runnable-track {
            background: linear-gradient(
              to right,
              hsl(0deg 100% 50%) 0,
              hsl(15deg 100% 50%) calc(15 / 360 * 100%),
              hsl(30deg 100% 50%) calc(15 * 2 / 360 * 100%),
              hsl(45deg 100% 50%) calc(15 * 3 / 360 * 100%),
              hsl(60deg 100% 50%) calc(15 * 4 / 360 * 100%),
              hsl(75deg 100% 50%) calc(15 * 5 / 360 * 100%),
              hsl(90deg 100% 50%) calc(15 * 6 / 360 * 100%),
              hsl(105deg 100% 50%) calc(15 * 7 / 360 * 100%),
              hsl(120deg 100% 50%) calc(15 * 8 / 360 * 100%),
              hsl(135deg 100% 50%) calc(15 * 9 / 360 * 100%),
              hsl(150deg 100% 50%) calc(15 * 10 / 360 * 100%),
              hsl(165deg 100% 50%) calc(15 * 11 / 360 * 100%),
              hsl(180deg 100% 50%) calc(15 * 12 / 360 * 100%),
              hsl(195deg 100% 50%) calc(15 * 13 / 360 * 100%),
              hsl(210deg 100% 50%) calc(15 * 14 / 360 * 100%),
              hsl(225deg 100% 50%) calc(15 * 15 / 360 * 100%),
              hsl(240deg 100% 50%) calc(15 * 16 / 360 * 100%),
              hsl(255deg 100% 50%) calc(15 * 17 / 360 * 100%),
              hsl(270deg 100% 50%) calc(15 * 18 / 360 * 100%),
              hsl(285deg 100% 50%) calc(15 * 19 / 360 * 100%),
              hsl(300deg 100% 50%) calc(15 * 20 / 360 * 100%),
              hsl(315deg 100% 50%) calc(15 * 21 / 360 * 100%),
              hsl(330deg 100% 50%) calc(15 * 22 / 360 * 100%),
              hsl(345deg 100% 50%) calc(15 * 23 / 360 * 100%),
              hsl(360deg 100% 50%) calc(15 * 24 / 360 * 100%)
            );
          }
          &::-moz-range-track {
            background: linear-gradient(
              to right,
              hsl(0deg 100% 50%) 0,
              hsl(15deg 100% 50%) calc(15 / 360 * 100%),
              hsl(30deg 100% 50%) calc(15 * 2 / 360 * 100%),
              hsl(45deg 100% 50%) calc(15 * 3 / 360 * 100%),
              hsl(60deg 100% 50%) calc(15 * 4 / 360 * 100%),
              hsl(75deg 100% 50%) calc(15 * 5 / 360 * 100%),
              hsl(90deg 100% 50%) calc(15 * 6 / 360 * 100%),
              hsl(105deg 100% 50%) calc(15 * 7 / 360 * 100%),
              hsl(120deg 100% 50%) calc(15 * 8 / 360 * 100%),
              hsl(135deg 100% 50%) calc(15 * 9 / 360 * 100%),
              hsl(150deg 100% 50%) calc(15 * 10 / 360 * 100%),
              hsl(165deg 100% 50%) calc(15 * 11 / 360 * 100%),
              hsl(180deg 100% 50%) calc(15 * 12 / 360 * 100%),
              hsl(195deg 100% 50%) calc(15 * 13 / 360 * 100%),
              hsl(210deg 100% 50%) calc(15 * 14 / 360 * 100%),
              hsl(225deg 100% 50%) calc(15 * 15 / 360 * 100%),
              hsl(240deg 100% 50%) calc(15 * 16 / 360 * 100%),
              hsl(255deg 100% 50%) calc(15 * 17 / 360 * 100%),
              hsl(270deg 100% 50%) calc(15 * 18 / 360 * 100%),
              hsl(285deg 100% 50%) calc(15 * 19 / 360 * 100%),
              hsl(300deg 100% 50%) calc(15 * 20 / 360 * 100%),
              hsl(315deg 100% 50%) calc(15 * 21 / 360 * 100%),
              hsl(330deg 100% 50%) calc(15 * 22 / 360 * 100%),
              hsl(345deg 100% 50%) calc(15 * 23 / 360 * 100%),
              hsl(360deg 100% 50%) calc(15 * 24 / 360 * 100%)
            );
          }
        }
        &--saturation {
          &::-webkit-slider-runnable-track {
            background: linear-gradient(
              to right,
              hsl(calc(var(--hue) * 1deg) 0% 50%),
              hsl(calc(var(--hue) * 1deg) 100% 50%)
            );
          }
          &::-moz-range-track {
            background: linear-gradient(
              to right,
              hsl(calc(var(--hue) * 1deg) 0% 50%),
              hsl(calc(var(--hue) * 1deg) 100% 50%)
            );
          }
        }
        &--brightness {
          &::-webkit-slider-runnable-track {
            background: linear-gradient(to right, #000, #fff);
          }
          &::-moz-range-track {
            background: linear-gradient(to right, #000, #fff);
          }
        }
      }
    }
    input[type="text"] {
      width: 5rem;
      text-align: right;
    }
    input[type="range"] {
      appearance: none;
      -webkit-appearance: none;
      outline: none;
      background: transparent;
      width: 12rem;
      height: 1rem;
      &:hover {
        cursor: grab;
      }
      &:active {
        cursor: grabbing;
      }
      &::-webkit-slider-runnable-track {
        height: 0.8rem;
        border-radius: 0.8rem;
        border: 0.1rem lightgray solid;
      }
      &::-moz-range-track {
        height: 0.8rem;
        border-radius: 0.8rem;
        border: 0.1rem lightgray solid;
      }
      &::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        height: 1rem;
        width: 1rem;
        background-color: #4cabe2;
        border-radius: 50%;
        border: 0.1rem lightgray solid;
        margin-top: -0.1rem; // (trackのheight - thumbのheight) / 2
      }
      &::-moz-range-thumb {
        -webkit-appearance: none;
        appearance: none;
        height: 1rem;
        width: 1rem;
        background-color: #4cabe2;
        border-radius: 50%;
        border: 0.1rem lightgray solid;
        margin-top: -0.1rem; // (trackのheight - thumbのheight) / 2
      }
    }
  }
}
</style>
