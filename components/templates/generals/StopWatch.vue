<script setup lang="ts">
import { computed, onUnmounted, reactive } from "vue";
import { TOUColor } from "@/types/common/css/color";
import { TOUFont } from "@/types/common/css/font";

const props = defineProps({
  bgColor: {
    type: TOUColor,
    default: new TOUColor(TOUColor.CODE_WHITE),
  },
  font: {
    type: TOUFont,
    default: new TOUFont({
      size: 1,
    }),
  },
  button: {
    type: String,
    default: "right",
  },
});

const timmer: {
  count: 0;
  isStop: boolean;
} = reactive({
  count: 0,
  isStop: true,
});

const ONE_SECOUND = 1000;
const ONE_MINUTE = ONE_SECOUND * 60;
const ONE_HOUR = ONE_MINUTE * 60;
const time = computed(() => {
  // count = 60 * 60 * 1000 * hh + 60 * 1000 * mm + 1000 * ss + ms
  const hh = Math.floor(timmer.count / ONE_HOUR);
  const mm = Math.floor((timmer.count - ONE_HOUR * hh) / ONE_MINUTE);
  const ss = Math.floor(
    (timmer.count - ONE_HOUR * hh - ONE_MINUTE * mm) / ONE_SECOUND
  );
  const ms = Math.floor(
    (timmer.count - ONE_HOUR * hh - ONE_MINUTE * mm - ONE_SECOUND * ss) / 10
  );
  return [
    hh.toString().padStart(2, "0"),
    mm.toString().padStart(2, "0"),
    ss.toString().padStart(2, "0"),
    ms.toString().padStart(2, "0"),
  ].join(":");
});

const backgroundStyle = computed(() => `background: ${props.bgColor.rgba()}`);
const fontStyle = computed(() => props.font.getStyle());
const buttonPosition = computed(() => {
  if (!["right", "left", "up", "down"].includes(props.button)) {
    return "right";
  }
  return props.button;
});

let stopInterval = () => {};
const superInterval = (func: () => void, interval: number) => {
  // タイマー実行時に別タブを見るとタイマーがずれるのでWorkerを使用
  try {
    const code = `self.addEventListener('message', msg=>{setInterval(()=>self.postMessage(null), msg.data)})`;
    const worker = new Worker(`data:text/javascript;base64,${btoa(code)}`);
    worker.onmessage = () => func();
    worker.postMessage(interval);
    return { stop: () => worker.terminate() };
  } catch (_) {
    // Worker が使えない場合は setInterval を使う
    const id = setInterval(func, interval);
    return { stop: () => clearInterval(id) };
  }
};
const onStart = () => {
  timmer.isStop = false;
  const { stop } = superInterval(() => {
    if (timmer.isStop) {
      stopInterval();
      return;
    }
    timmer.count += 10;
  }, 10);
  stopInterval = stop;
};

const onStop = () => {
  timmer.isStop = true;
};
const onReset = () => {
  timmer.count = 0;
};
onUnmounted(() => {
  stopInterval();
});
</script>

<template>
  <div class="c-contents" :style="[backgroundStyle, fontStyle]">
    <div :class="`c-button_position--${buttonPosition}`">
      <div class="c-contents__time">
        <span>{{ time }}</span>
      </div>
      <div class="c-contents__buttons">
        <button
          v-if="timmer.isStop"
          class="c-contents__buttons__button c-contents__buttons__button--start"
          @click="onStart"
        >
          スタート
        </button>
        <button
          v-else
          class="c-contents__buttons__button c-contents__buttons__button--stop"
          @click="onStop"
        >
          ストップ
        </button>
        <button
          :disabled="!timmer.isStop"
          class="c-contents__buttons__button c-contents__buttons__button--reset"
          @click="onReset"
        >
          リセット
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.c-contents {
  &__time {
    align-self: center;
    padding: 0.1rem;
    > span {
      letter-spacing: 0.1em;
    }
  }
  &__buttons {
    display: flex;
    &__button {
      cursor: pointer;
      width: 8rem;
      height: 2.4rem;
      &:hover {
        opacity: 0.8;
      }
      &:active {
        opacity: 1;
      }
      &:disabled {
        background-color: lightgray;
        cursor: not-allowed;
        &:hover {
          opacity: 1;
        }
        &:active {
          opacity: 1;
        }
      }
      &--start {
        background-color: springgreen;
      }
      &--stop {
        background-color: red;
      }
      &--reset {
        background-color: yellow;
      }
    }
  }
}
.c-button_position {
  &--right {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  &--left {
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    align-items: center;
  }
  &--up {
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
    justify-content: flex-start;
  }
  &--down {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
  }
}
</style>
