<script setup lang="ts">
import { computed, ref, watch } from "vue";
import InputText from "@/components/atoms/interfaces/InputText.vue";
import InputSlideAndNumber from "@/components/molecules/interfaces/InputSlideAndNumber.vue";
import { TOUColor, TOUHSBColor } from "@/types/common/color";

const props = defineProps({
  color: {
    type: TOUColor,
    required: true,
  },
  // 透明度の選択可否
  inputAlpha: {
    type: Boolean,
    default: true,
  },
});

const emits = defineEmits(["update:color"]);

const input = ref({
  hue: props.color.hsb.hue,
  saturation: props.color.hsb.saturation * 100,
  brightness: props.color.hsb.brightness * 100,
  alpha: props.color.alpha * 100,
});
watch(
  () => props.color,
  () => {
    const hsb = props.color.hsb;
    input.value.hue = hsb.hue;
    input.value.saturation = Math.round(hsb.saturation * 100);
    input.value.brightness = Math.round(hsb.brightness * 100);
    input.value.alpha = Math.round(props.color.alpha * 100);
  }
);
watch(
  () => input.value,
  () => {
    const code = TOUHSBColor.numberToCode(
      input.value.hue,
      input.value.saturation / 100,
      input.value.brightness / 100
    );
    const color = new TOUColor(code, input.value.alpha / 100);
    emits("update:color", color);
  },
  { deep: true }
);
const rgba = computed(() => props.color.getRGBA());
const onChangeCode = (event: Event) => {
  const text = (event.target as HTMLInputElement).value;
  if (!TOUColor.CODE_FORMAT.test(text)) {
    return;
  }
  const newColor = new TOUColor(text, props.color.alpha);
  input.value.hue = newColor.hsb.hue;
  input.value.saturation = newColor.hsb.saturation * 100;
  input.value.brightness = newColor.hsb.brightness * 100;
};
</script>

<template>
  <div class="c-input_color">
    <i class="c-input_color__display" :style="{ background: rgba }" />
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
          v-model="input.hue"
          :max="359"
          :min="0"
          sliderBackground="linear-gradient(
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
            )"
        />
      </div>
      <div class="c-input_color__forms__inputs" :style="{ '--hue': input.hue }">
        <InputSlideAndNumber
          v-model="input.saturation"
          :max="100"
          :min="0"
          sliderBackground="linear-gradient(
              to right,
              hsl(calc(var(--hue) * 1deg) 0% 50%),
              hsl(calc(var(--hue) * 1deg) 100% 50%)
            )"
        />
      </div>
      <div class="c-input_color__forms__inputs">
        <InputSlideAndNumber
          v-model="input.brightness"
          :max="100"
          :min="0"
          sliderBackground="linear-gradient(to right, #000, #fff)"
        />
      </div>
      <template v-if="inputAlpha">
        <div class="c-input_color__forms__inputs">
          <InputSlideAndNumber
            v-model="input.alpha"
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
