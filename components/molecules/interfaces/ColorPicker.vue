<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import InputNumber from "@/components/molecules/interfaces/InputNumber.vue";
import { TOURGBColor } from "@/types/common/css/color";

const props = defineProps({
  isShowModal: {
    type: Boolean,
    default: false,
  },
  color: {
    type: TOURGBColor,
    default: undefined,
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

const input = reactive({
  red: 255,
  green: 255,
  blue: 255,
  opacity: 100,
});
const color = computed(() => {
  return new TOURGBColor(
    TOURGBColor.numberToCode(input.red, input.green, input.blue),
    input.opacity / 100
  ).rgba();
});
const resetColor = () => {
  if (!props.color || !TOURGBColor.CODE_FORMAT.test(props.color.code)) {
    input.red = 255;
    input.green = 255;
    input.blue = 255;
    return;
  }
  input.red = props.color.getRed();
  input.green = props.color.getGreen();
  input.blue = props.color.getBlue();
};

const resetOpacity = () => {
  if (!props.color) {
    input.opacity = 100;
    return;
  }
  const num = Math.round(props.color.opacity * 100);
  if (Number.isNaN(num)) {
    input.opacity = 100;
    return;
  }
  if (num <= 0) {
    input.opacity = 0;
    return;
  }
  if (num >= 100) {
    input.opacity = 100;
    return;
  }
  input.opacity = num;
};
/**
 * 親から渡される色の監視
 * 親が変わった場合はコンポーネント内で扱っている色も変える
 */
watch(
  () => props.color,
  () => {
    resetColor();
    resetOpacity();
  }
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
  emits(
    "submit",
    new TOURGBColor(
      TOURGBColor.numberToCode(input.red, input.green, input.blue),
      input.opacity / 100
    )
  );
};
</script>

<template>
  <div class="c-color_picker">
    <transition>
      <div v-show="isShowModal" class="c-color_picker__modal">
        <div class="c-color_picker__modal__contents">
          <i
            class="c-color_picker__modal__contents__display"
            :style="{ background: color }"
          />
          <div class="c-color_picker__modal__contents__forms">
            <div class="c-color_picker__modal__contents__forms__inputs">
              <input
                v-model.number="input.red"
                type="range"
                :max="255"
                :min="0"
                class="c-color_picker__modal__contents__forms__inputs__slider--red"
              />
              <InputNumber v-model="input.red" :max="255" :min="0" />
            </div>
            <div class="c-color_picker__modal__contents__forms__inputs">
              <input
                v-model.number="input.green"
                type="range"
                :max="255"
                :min="0"
                class="c-color_picker__modal__contents__forms__inputs__slider--green"
              />
              <InputNumber v-model="input.green" :max="255" :min="0" />
            </div>
            <div class="c-color_picker__modal__contents__forms__inputs">
              <input
                v-model.number="input.blue"
                type="range"
                :max="255"
                :min="0"
                class="c-color_picker__modal__contents__forms__inputs__slider--blue"
              />
              <InputNumber v-model="input.blue" :max="255" :min="0" />
            </div>
            <template v-if="pickableOpacity">
              <div class="c-color_picker__modal__contents__forms__inputs">
                <input
                  v-model.number="input.opacity"
                  type="range"
                  :max="100"
                  :min="0"
                  class="c-color_picker__modal__contents__forms__inputs__slider--opacity"
                />
                <InputNumber v-model="input.opacity" :max="100" :min="0" />
              </div>
            </template>
          </div>
        </div>

        <div class="c-color_picker__modal__buttons">
          <button @click="onClose">Cancel</button>
          <button @click="onSubmit">OK</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped lang="scss">
.c-color_picker {
  position: absolute;
  z-index: 10;
  &__modal {
    background-color: #ffffff;
    border: 0.1rem black solid;
    padding: 0.4rem;
    &__contents {
      display: flex;
      gap: 0 0.8rem;
      &__display {
        display: block;
        width: 8rem;
        height: 8rem;
        background-color: var(--color);
        opacity: var(--opacity);
        border: 0.1rem lightgray solid;
      }
      &__forms {
        display: flex;
        flex-direction: column;
        gap: 0.4rem 0;
        &__inputs {
          display: flex;
          flex-direction: row;
          gap: 0 0.4rem;
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
