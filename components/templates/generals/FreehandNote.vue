<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import ToolButton from "@/components/atoms/interfaces/ToolButton.vue";
import InputNumber from "@/components/molecules/interfaces/InputNumber.vue";
import ColorPicker from "@/components/molecules/interfaces/ColorPicker.vue";
import { TOUColor } from "@/types/common/css/color";
import BasicButton from "~/components/atoms/interfaces/BasicButton.vue";

const isShowPenColorPicker = ref(false);
const pen = reactive({
  color: new TOUColor(TOUColor.CODE_BLACK),
  isUseEraser: false,
  size: 1,
});

const canvas: Ref<HTMLCanvasElement | null> = ref(null);
const mouse = ref({ x: 0, y: 0 });
const drawer = computed(() => {
  if (!canvas || !canvas.value) {
    return null;
  }
  return canvas.value.getContext("2d");
});
const draw = {
  x: 0,
  y: 0,
  isMoved: false,
};

const onSubmitPenColor = (newColor: TOUColor) => {
  pen.color = newColor;
};

const onClear = () => {
  if (!canvas.value || !drawer.value) {
    return;
  }
  drawer.value.clearRect(0, 0, canvas.value.width, canvas.value.height);
};

const onMousemove = (e: MouseEvent) => {
  mouse.value.x = e.offsetX;
  mouse.value.y = e.offsetY;
  onDraw(e);
};
const onDrawStart = (e: MouseEvent) => {
  if (!canvas.value || !drawer.value) {
    return;
  }
  draw.x = e.offsetX;
  draw.y = e.offsetY;
  drawer.value.beginPath();
  drawer.value.moveTo(draw.x, draw.y);
};
const onDraw = (e: MouseEvent) => {
  if (!canvas.value || !drawer.value) {
    return;
  }
  if (e.buttons !== 1) {
    return;
  }
  draw.x = e.offsetX;
  draw.y = e.offsetY;
  draw.isMoved = true;

  if (pen.isUseEraser) {
    drawer.value.globalCompositeOperation = "destination-out";
  } else {
    drawer.value.globalCompositeOperation = "source-over";
    drawer.value.globalAlpha = pen.color.opacity;
    drawer.value.strokeStyle = pen.color.code;
  }

  drawer.value.lineTo(draw.x, draw.y);
  drawer.value.lineCap = "round";
  drawer.value.lineWidth = pen.size;
  drawer.value.stroke();
};

const onDrawEnd = () => {
  if (!drawer.value) {
    return;
  }

  if (draw.isMoved) {
    draw.isMoved = false;
    return;
  }
  if (pen.isUseEraser) {
    drawer.value.globalCompositeOperation = "destination-out";
  } else {
    drawer.value.globalCompositeOperation = "source-over";
    drawer.value.globalAlpha = pen.color.opacity;
    drawer.value.strokeStyle = pen.color.code;
  }

  drawer.value.lineTo(draw.x - 1, draw.y - 1);
  drawer.value.lineCap = "round";
  drawer.value.lineWidth = pen.size;
  drawer.value.stroke();
};
</script>

<template>
  <div class="c-container">
    <div class="c-container__toolbar">
      <div class="c-container__toolbar__menu">
        <div class="c-container__toolbar__menu__colorpicker">
          <ToolButton @click="isShowPenColorPicker = true">
            <div
              class="c-container__toolbar__menu__colorpicker__button"
              :style="{
                '--color': pen.color.code,
                '--opacity': pen.color.opacity,
              }"
            >
              <img src="/commons/icons/pen.svg" alt="ペン色" />
            </div>
          </ToolButton>
          <ColorPicker
            v-model:isShowModal="isShowPenColorPicker"
            :color="pen.color"
            class="c-container__toolbar__menu__colorpicker__picker"
            @submit="onSubmitPenColor"
          />
        </div>
        <div class="c-container__toolbar__menu__eraser">
          <input
            v-model="pen.isUseEraser"
            type="checkbox"
            id="pen__eraser"
            @mousedown.prevent
          />
          <label for="pen__eraser" @mousedown.prevent>
            <img src="/commons/icons/eraser.svg" alt="消しゴム" />
          </label>
        </div>
        <div class="c-container__toolbar__menu__size">
          <img src="/commons/icons/line_weight.svg" alt="ペンサイズ" />
          <div class="c-container__toolbar__menu__size--input">
            <InputNumber v-model="pen.size" :min="1" :max="72" mode="uint" />
          </div>
        </div>
      </div>
      <div class="c-container__toolbar__menu">
        <div class="c-container__toolbar__menu__button">
          <BasicButton label="クリア" @click="onClear" />
        </div>
      </div>
    </div>

    <div class="c-container__memo u-margin_top--20">
      <div
        class="c-container__memo__layer"
        :class="{
          'u-mouse_icon--pen': !pen.isUseEraser,
          'u-mouse_icon--eraser': pen.isUseEraser,
        }"
        :style="{
          '--mouseX': mouse.x,
          '--mouseY': mouse.y,
          '--pensize': pen.size,
        }"
      >
        <canvas ref="canvas" width="500" height="800"></canvas>
        <div
          class="c-container__memo__layer__clickpanel"
          @mousedown.prevent="onDrawStart"
          @mousemove="onMousemove"
          @mouseup="onDrawEnd"
        ></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.c-container {
  width: 100%;
  height: 100%;
  &__toolbar {
    display: flex;
    justify-content: space-between;
    background-color: white;
    height: 2rem;
    &__menu {
      display: flex;
      &__colorpicker {
        &__button {
          &::before {
            content: "";
            position: absolute;
            top: 1.5rem;
            left: 50%;
            transform: translateX(-50%);
            background-color: var(--color);
            opacity: var(--opacity);
            width: 1em;
            height: 0.2rem;
          }
        }
        &__picker {
          position: absolute;
          top: 0;
          left: 6rem;
        }
      }
      &__eraser {
        position: relative;
        input[type="checkbox"] {
          appearance: none;
          display: none;
          width: 2.4rem;
          height: 100%;
          + label {
            display: block;
            width: 2.4rem;
            height: 100%;
            background-color: white;
            border: 0.1rem solid black;
            cursor: pointer;
            img {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            }
            &:hover {
              background-color: #eee;
            }
          }
          &:checked + label {
            background-color: #ffaaaa;
          }
        }
      }
      // フォントサイズ用のstyle
      &__size {
        display: flex;
        align-items: center;
        height: 100%;
        width: 6rem;
        border: 0.1rem solid black;
        padding: 0rem 0.4rem;
        gap: 0 0.4rem;
        &--input {
          height: 80%;
          width: 3em;
        }
      }
      &__button {
        width: 4rem;
      }
    }
  }
  &__memo {
    position: relative;
    width: 100%;
    height: 600px;
    background-color: white;
    font-family: sans-serif;
    white-space: pre;
    &__layer {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      padding: 0.2rem;
      border: 0.1rem solid black;
      overflow: hidden;
      &__clickpanel {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
      &::before {
        content: "";
        position: absolute;
        top: calc(var(--mouseY) * 1px);
        left: calc(var(--mouseX) * 1px);
        width: calc(var(--pensize) * 1px);
        aspect-ratio: 1;
        border-radius: 100%;
        border: 0.1rem solid black;
        transform: translate(-50%, -50%);
      }
    }
  }
}
.u-mouse_icon--pen {
  cursor:
    url("/commons/icons/pen.svg") 0 16,
    auto;
}
.u-mouse_icon--eraser {
  cursor:
    url("/commons/icons/eraser.svg") 0 16,
    auto;
}
</style>
