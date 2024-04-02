<script setup lang="ts">
import { ref } from "vue";
import InputColorModal from "@/components/molecules/modals/InputColorModal.vue";
import ColorButton from "@/components/atoms/interfaces/ColorButton.vue";
import { TOURGBColor } from "@/types/common/css/color";

const props = defineProps({
  color: {
    type: TOURGBColor,
    default: new TOURGBColor(TOURGBColor.CODE_WHITE),
  },
  inputOpacity: {
    type: Boolean,
    default: true,
  },
});
const emits = defineEmits(["submit"]);

const isShowModal = ref(false);

const onClickButton = () => {
  isShowModal.value = true;
};

const onSubmit = (color: TOURGBColor) => {
  emits("submit", color);
};
</script>

<template>
  <div class="c-input_color_with_button">
    <ColorButton :color="props.color" @click="onClickButton" />
    <InputColorModal
      v-model:isShowModal="isShowModal"
      :color="props.color"
      :inputOpacity="props.inputOpacity"
      class="c-input_color_with_button__input"
      @submit="onSubmit"
    />
  </div>
</template>

<style scoped lang="scss">
.c-input_color_with_button {
  position: relative;
  width: 100%;
  height: 100%;
  &__input {
    position: absolute;
    top: 0;
    left: 50%;
  }
}
</style>
