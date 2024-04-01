<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { TOURGBColor } from "@/types/common/css/color";
import IntegratedColorPicker from "@/components/organisms/interfaces/IntegratedColorPicker.vue";

const props = defineProps({
  isShowModal: {
    type: Boolean,
    default: false,
  },
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
const emits = defineEmits(["update:isShowModal", "submit"]);

const isShowModal = ref(false);
watch(
  () => props.isShowModal,
  () => {
    isShowModal.value = props.isShowModal;
  }
);
watch(
  () => isShowModal.value,
  () => {
    emits("update:isShowModal", isShowModal.value);
  }
);

const color = ref(props.color);
const resetColor = () => {
  color.value = props.color;
};
/**
 * 親から渡される色の監視
 * 親が変わった場合はコンポーネント内で扱っている色も変える
 */
watch(
  () => props.color,
  () => resetColor
);

// アクションイベント
onMounted(() => {
  resetColor();
});
const onClose = () => {
  resetColor();
  isShowModal.value = false;
};
const onSubmit = () => {
  isShowModal.value = false;
  emits("submit", color.value);
};
</script>

<template>
  <div class="c-color_pick_modal">
    <transition>
      <div v-show="isShowModal" class="c-color_pick_modal__inner">
        <div class="c-color_pick_modal__inner__contents">
          <IntegratedColorPicker
            v-model:color="color"
            :pickableAlpha="props.pickableOpacity"
          />
        </div>

        <div class="c-color_pick_modal__inner__buttons">
          <button @click="onClose">Cancel</button>
          <button @click="onSubmit">OK</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped lang="scss">
.c-color_pick_modal {
  position: absolute;
  z-index: 10;
  box-shadow: 0rem 0rem 0.8rem #aaa;
  &__inner {
    background-color: #ffffff;
    border: 0.1rem black solid;
    padding: 0.4rem;
    display: flex;
    flex-direction: column;
    gap: 0.8rem 0;
    &__buttons {
      display: flex;
      justify-content: flex-end;
      button {
        display: block;
        width: 6rem;
        height: 2rem;
        background-color: white;
        border: 0.1rem solid black;
        padding: 0.5rem;
        cursor: pointer;
        + button {
          margin-left: 0.8rem;
        }
        &:hover {
          background-color: #eeeeee;
        }
      }
    }
  }
}
.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease-out;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
