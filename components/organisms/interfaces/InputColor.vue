<script setup lang="ts">
import InputHSBColor from "@/components/molecules/interfaces/InputHSBColor.vue";
import InputRGBColor from "@/components/molecules/interfaces/InputRGBColor.vue";
import { TOURGBColor } from "@/types/common/css/color";

const props = defineProps({
  color: {
    type: Object as PropType<TOURGBColor>,
    required: true,
  },
  inputAlpha: {
    type: Boolean,
    default: true,
  },
});
const emits = defineEmits(["update:color"]);

type ColorMode = "RGB" | "HSV";
const color = computed({
  get: () => props.color,
  set: (newValue) => emits("update:color", newValue),
});
const mode: Ref<ColorMode> = ref("RGB");
</script>

<template>
  <div class="c-input_color">
    <div class="c-input_color__tab">
      <button
        class="c-input_color__tab__button"
        :class="{ 'c-input_color__tab__button--selected': mode === 'RGB' }"
        @click="mode = 'RGB'"
      >
        RGB
      </button>
      <button
        class="c-input_color__tab__button"
        :class="{ 'c-input_color__tab__button--selected': mode === 'HSV' }"
        @click="mode = 'HSV'"
      >
        HSV
      </button>
    </div>
    <div class="c-input_color__main">
      <InputRGBColor
        v-if="mode === 'RGB'"
        v-model:color="color"
        :inputOpacity="props.inputAlpha"
      />
      <InputHSBColor
        v-else-if="mode === 'HSV'"
        v-model:color="color"
        :inputAlpha="props.inputAlpha"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.c-input_color {
  &__tab {
    display: flex;
    flex-wrap: nowrap;
    box-shadow: 0.2rem 0rem 0.4rem #ddd;
    width: fit-content;
    &__button {
      padding: 0.2rem;
      background: #eee;
      border: 0.1rem solid #ddd;
      border-top-left-radius: 10%;
      border-top-right-radius: 10%;
      border-bottom: none;
      color: #aaa;
      cursor: pointer;
      &--selected {
        background: white;
        color: black;
        box-shadow: none;
      }
    }
  }
  &__main {
    padding: 0.4rem;
    border: 0.1rem solid #ddd;
    border-top: none;
    width: fit-content;
    box-shadow: 0.1rem -0.1rem 0.2rem #ddd;
  }
}
</style>
