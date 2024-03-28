<script setup lang="ts">
import { ref } from "vue";
import ColorPickModal from "@/components/molecules/modals/ColorPickModal.vue";
import ColorPickButton from "@/components/atoms/interfaces/ColorPickButton.vue";
import { TOURGBColor } from "@/types/common/css/color";

const props = defineProps({
  color: {
    type: TOURGBColor,
    default: new TOURGBColor(TOURGBColor.CODE_WHITE),
  },
  pickableOpacity: {
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
  <div class="c-color_pick_with_button">
    <ColorPickButton :color="props.color" @click="onClickButton" />
    <ColorPickModal
      v-model:isShowModal="isShowModal"
      :color="props.color"
      :pickableOpacity="props.pickableOpacity"
      class="c-color_pick_with_button__picker"
      @submit="onSubmit"
    />
  </div>
</template>

<style scoped lang="scss">
.c-color_pick_with_button {
  position: relative;
  width: 100%;
  height: 100%;
  &__picker {
    position: absolute;
    top: 0;
    left: 50%;
  }
}
</style>
