<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps({
  isShowModal: {
    type: Boolean,
    default: false,
  },
});
const emits = defineEmits(["update:isShowModal", "submit", "cancel"]);

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

// アクションイベント
const onClose = () => {
  isShowModal.value = false;
  emits("cancel");
};
const onSubmit = () => {
  isShowModal.value = false;
  emits("submit");
};
</script>

<template>
  <div class="c-input_color_modal">
    <transition>
      <div v-show="isShowModal" class="c-input_color_modal__inner">
        <div class="c-input_color_modal__inner__contents">
          <slot />
        </div>

        <div class="c-input_color_modal__inner__buttons">
          <button @click="onClose">Cancel</button>
          <button @click="onSubmit">OK</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped lang="scss">
.c-input_color_modal {
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
  transition: opacity 0.3s ease-in-out;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
