<script setup lang="ts">
import { computed, ref, watch } from "vue";
import InputNumber from "@/components/molecules/interfaces/InputNumber.vue";
import InputText from "@/components/atoms/interfaces/InputText.vue";
import { TOURGBColor } from "@/types/common/css/color";

const props = defineProps({
  color: {
    type: TOURGBColor,
    required: true,
  },
  // 透明度の選択可否
  pickableOpacity: {
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
          v-model.number="input.red"
          type="range"
          :max="255"
          :min="0"
          class="c-color_picker__forms__inputs__slider--red"
        />
        <InputNumber v-model="input.red" :max="255" :min="0" />
      </div>
      <div class="c-color_picker__forms__inputs">
        <input
          v-model.number="input.green"
          type="range"
          :max="255"
          :min="0"
          class="c-color_picker__forms__inputs__slider--green"
        />
        <InputNumber v-model="input.green" :max="255" :min="0" />
      </div>
      <div class="c-color_picker__forms__inputs">
        <input
          v-model.number="input.blue"
          type="range"
          :max="255"
          :min="0"
          class="c-color_picker__forms__inputs__slider--blue"
        />
        <InputNumber v-model="input.blue" :max="255" :min="0" />
      </div>
      <template v-if="pickableOpacity">
        <div class="c-color_picker__forms__inputs">
          <input
            v-model.number="input.opacity"
            type="range"
            :max="100"
            :min="0"
            class="c-color_picker__forms__inputs__slider--opacity"
          />
          <InputNumber v-model="input.opacity" :max="100" :min="0" />
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
        &--red {
          &::-webkit-slider-runnable-track {
            background: linear-gradient(to right, #fff, #ff0000);
          }
          &::-moz-range-track {
            background: linear-gradient(to right, #fff, #ff0000);
          }
        }
        &--green {
          &::-webkit-slider-runnable-track {
            background: linear-gradient(to right, #fff, #00ff00);
          }
          &::-moz-range-track {
            background: linear-gradient(to right, #fff, #00ff00);
          }
        }
        &--blue {
          &::-webkit-slider-runnable-track {
            background: linear-gradient(to right, #fff, #0000ff);
          }
          &::-moz-range-track {
            background: linear-gradient(to right, #fff, #0000ff);
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
