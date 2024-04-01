<script setup lang="ts">
import HSBColorPicker from "@/components/molecules/interfaces/HSBColorPicker.vue";
import RGBColorPicker from "@/components/molecules/interfaces/RGBColorPicker.vue";
import { TOURGBColor } from "@/types/common/css/color";

const props = defineProps({
  color: {
    type: Object as PropType<TOURGBColor>,
    required: true,
  },
  pickableAlpha: {
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
  <div class="c-color_picker">
    <div class="c-color_picker__tab">
      <button
        class="c-color_picker__tab__button"
        :class="{ 'c-color_picker__tab__button--selected': mode === 'RGB' }"
        @click="mode = 'RGB'"
      >
        RGB
      </button>
      <button
        class="c-color_picker__tab__button"
        :class="{ 'c-color_picker__tab__button--selected': mode === 'HSV' }"
        @click="mode = 'HSV'"
      >
        HSV
      </button>
    </div>
    <div class="c-color_picker__main">
      <RGBColorPicker
        v-if="mode === 'RGB'"
        v-model:color="color"
        :pickableOpacity="props.pickableAlpha"
      />
      <HSBColorPicker
        v-else-if="mode === 'HSV'"
        v-model:color="color"
        :pickableAlpha="props.pickableAlpha"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.c-color_picker {
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
