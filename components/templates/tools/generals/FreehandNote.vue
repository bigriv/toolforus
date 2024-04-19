<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import BasicButton from "@/components/atoms/interfaces/BasicButton.vue";
import ToolCheckButton from "@/components/atoms/interfaces/ToolCheckButton.vue";
import ToolInputNumber from "@/components/molecules/interfaces/ToolInputNumber.vue";
import InputColorToolButton from "@/components/organisms/interfaces/InputColorToolButton.vue";
import { TOUColor } from "@/types/common/color/color";

const pen = reactive({
  color: new TOUColor(TOUColor.CODE_BLACK),
  isUseEraser: false,
  size: 1,
});

const canvas = ref<HTMLCanvasElement>();
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
    drawer.value.globalAlpha = pen.color.alpha;
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
    drawer.value.globalAlpha = pen.color.alpha;
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
        <InputColorToolButton
          v-model:color="pen.color"
          icon="/commons/icons/pen.svg"
          label="ペンの色"
        />
        <ToolCheckButton
          v-model="pen.isUseEraser"
          icon="/commons/icons/eraser.svg"
          label="消しゴム"
        />
        <ToolInputNumber
          v-model="pen.size"
          icon="/commons/icons/line_weight.svg"
          label="ペンサイズ"
          :min="1"
          :max="72"
          mode="uint"
        />
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
  display: flex;
  flex-direction: column;
  &__toolbar {
    display: flex;
    justify-content: space-between;
    background-color: white;
    height: 2rem;
    &__menu {
      display: flex;
      &__button {
        width: 4rem;
      }
    }
  }
  &__memo {
    position: relative;
    width: 100%;
    background-color: white;
    font-family: sans-serif;
    white-space: pre;
    flex-grow: 1;
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
</style>
