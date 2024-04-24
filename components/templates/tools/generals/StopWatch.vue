<script setup lang="ts">
import { computed, onUnmounted, reactive, type PropType } from "vue";
import BasicSelect from "@/components/atoms/interfaces/BasicSelect.vue";
import ToolButton from "@/components/atoms/interfaces/ToolButton.vue";
import BasicButton from "@/components/atoms/interfaces/BasicButton.vue";
import InputText from "@/components/atoms/interfaces/InputText.vue";
import ToolRadioButtons from "@/components/atoms/interfaces/ToolRadioButtons.vue";
import BasicBalloon from "@/components/atoms/BasicBalloon.vue";
import ToolInputNumber from "@/components/molecules/interfaces/ToolInputNumber.vue";
import InputColorToolButton from "@/components/organisms/interfaces/InputColorToolButton.vue";
import { useStopwatchCustom } from "@/composables/tools/designs/generals/stopwatch/custom";
import { TOUColor } from "@/types/common/color/color";
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
      color: new TOUColor(TOUColor.CODE_BLACK),
      family: "Arial",
      weight: "normal",
    }),
  },
  position: {
    type: String as PropType<"left" | "center" | "right">,
    default: "left",
  },
});

const {
  fontFamilyList,
  fontWeightList,
  positionList,
  url,
  form,
  onCreateURL,
  onCopyURL,
} = useStopwatchCustom({
  bgColor: props.bgColor,
  font: props.font,
  position: props.position,
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

const backgroundStyle = computed(() => `background: ${form.bgColor.getRGBA()}`);
const fontStyle = computed(() => form.font.getStyle());

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
  <div class="c-stopwatch">
    <div class="c-stopwatch__toolbar">
      <div class="c-stopwatch__toolbar__menu">
        <InputColorToolButton
          v-model:color="form.bgColor"
          icon="/commons/icons/colors.svg"
          label="背景色"
        />
        <InputColorToolButton
          v-model:color="form.font.color"
          icon="/commons/icons/text.svg"
          label="文字色"
        />
        <ToolInputNumber
          v-model="form.font.size"
          :max="10"
          :min="0.1"
          :step="0.1"
          icon="/commons/icons/font_size.svg"
          label="フォントサイズ"
        />
        <div class="c-stopwatch__toolbar__menu__font_family">
          <BasicSelect v-model="form.font.family" :options="fontFamilyList" />
        </div>
        <ToolRadioButtons
          v-model:selected="form.font.weight"
          :list="fontWeightList"
        />
        <ToolRadioButtons
          v-model:selected="form.position"
          :list="positionList"
        />
      </div>
    </div>
    <div class="c-stopwatch__toolbar">
      <div class="c-stopwatch__toolbar__menu">
        <div>
          <ToolButton
            icon="/commons/icons/link.svg"
            label="共有できるリンクを生成"
            @click="onCreateURL"
          />
        </div>
        <div class="c-stopwatch__toolbar__menu__url">
          <InputText v-model:text="url" :readonly="true" />
        </div>
        <div>
          <BasicBalloon content="コピーしました" timming="click">
            <ToolButton
              icon="/commons/icons/copy.svg"
              label="リンクをコピー"
              @click="onCopyURL"
            />
          </BasicBalloon>
        </div>
      </div>
      <div class="c-stopwatch__toolbar__menu__buttons">
        <BasicButton
          v-if="timmer.isStop"
          label="スタート"
          :bgColor="new TOUColor('#00ff7f')"
          class="c-stopwatch__toolbar__menu__buttons__button"
          @click="onStart"
        />
        <BasicButton
          v-else
          label="ストップ"
          :bgColor="new TOUColor('#ff0000')"
          class="c-stopwatch__toolbar__menu__buttons__button"
          @click="onStop"
        />
        <BasicButton
          :disabled="!timmer.isStop"
          label="リセット"
          :bgColor="new TOUColor('#ffff00')"
          class="c-stopwatch__toolbar__menu__buttons__button"
          @click="onReset"
        />
      </div>
    </div>
    <div
      class="c-stopwatch__contents u-mgt-4"
      :style="[backgroundStyle, fontStyle]"
    >
      <div
        class="c-stopwatch__contents__time"
        :style="{ 'text-align': form.position }"
      >
        <span>{{ time }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.c-stopwatch {
  &__toolbar {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    width: 100%;
    background-color: white;
    &__menu {
      display: flex;
      &__buttons {
        display: flex;
        &__button {
          cursor: pointer;
          width: 6rem;
          height: 2rem;
        }
      }
      &__font_family {
        width: 13rem;
      }
      &__url {
        width: 28.6rem;
      }
    }
  }
  &__contents {
    display: flex;
    &__time {
      align-self: center;
      padding: 0.1rem;
      width: 100%;
      i > span {
        letter-spacing: 0.1em;
      }
    }
  }
}
</style>
