<script setup lang="ts">
import { ref } from "vue";
import ColorPickButton from "@/components/atoms/interfaces/ColorPickButton.vue";
import ColorPicker from "@/components/molecules/interfces/ColorPicker.vue";
import { TOUColor } from "@/types/common/color";

const props = defineProps({
  color: {
    type: TOUColor,
    default: new TOUColor(TOUColor.CODE_WHITE),
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

const onSubmit = (color: TOUColor) => {
  emits("submit", color);
};
</script>

<template>
  <div class="c-color_pick_with_button">
    <ColorPickButton :color="props.color" @click="onClickButton" />
    <ColorPicker
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
