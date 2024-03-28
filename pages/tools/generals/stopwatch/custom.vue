<script setup lang="ts">
import BasicBalloon from "@/components/atoms/BasicBalloon.vue";
import InputNumber from "@/components/molecules/interfaces/InputNumber.vue";
import ColorPickModalWithButton from "@/components/organisms/interfaces/ColorPickModalWithButton.vue";
import StopWatch from "@/components/templates/tools/generals/StopWatch.vue";
import { TOURGBColor } from "@/types/common/css/color";
import { TOUFont } from "@/types/common/css/font";

const url = ref("");
const form = reactive({
  bgColor: new TOURGBColor(TOURGBColor.CODE_WHITE),
  font: new TOUFont({
    size: 1,
    color: new TOURGBColor(TOURGBColor.CODE_BLACK),
    family: "Arial",
    weight: "normal",
  }),
  buttonPosition: "right",
});

const fontFamilyList = [
  "Arial",
  "Helvetica",
  "Helvetica Neue",
  "Segoe UI",
  "San Francisco",
  "ＭＳ ゴシック",
  "MS Pゴシック",
  "メイリオ",
  "ヒラギノ角ゴシック",
  "ヒラギノ丸ゴシック ProN",
  "Osaka",
  "游明朝",
  "ヒラギノ明朝 ProN W3",
  "MS 明朝",
];
const fontWeightList = [
  {
    value: "lighter",
    label: "細字",
  },
  {
    value: "normal",
    label: "中字",
  },
  {
    value: "bolder",
    label: "太字",
  },
];

const buttonPositionList = [
  {
    value: "right",
    label: "右側",
  },
  {
    value: "left",
    label: "左側",
  },
  {
    value: "up",
    label: "上側",
  },
  {
    value: "down",
    label: "下側",
  },
];

const onBgColorSubmit = (newColor: TOURGBColor) => {
  form.bgColor = newColor;
};
const onFontColorSubmit = (newColor: TOURGBColor) => {
  form.font.color = newColor;
};
const onCreateURL = () => {
  const temps: { [key: string]: string | number | undefined } = {};
  temps.bgColor = form.bgColor.code ?? "";
  temps.bgOpacity = form.bgColor.opacity ?? "";
  temps.fontColor = form.font.color.code ?? "";
  temps.fontOpacity = form.font.color.opacity ?? "";
  temps.fontSize = form.font.size ?? "";
  temps.fontWeight = form.font.weight ?? "";
  temps.fontFamily = form.font.family ?? "";
  temps.buttonPosition = form.buttonPosition ?? "";

  let params: Array<string> = [];
  for (const key of Object.keys(temps)) {
    let value: string | number | undefined = temps[key];
    if (!value) {
      value = "";
    } else if (typeof value === "number") {
      value = String(value);
    }
    params.push(`${key}=${value}`);
  }
  url.value = encodeURI(
    useRuntimeConfig().public.host +
      "/tools/generals/stopwatch/view?" +
      params.join("&")
  ).replace(/#/g, "%23");
};
const onCopy = () => {
  navigator.clipboard.writeText(url.value);
};
const onMove = () => {
  window.open(url.value, "_blank");
};
</script>

<template>
  <div class="c-continer">
    <div class="c-container__content">
      <dl>
        <dt>背景色</dt>
        <dd>
          <div class="c-container__content__colorpicker">
            <ColorPickModalWithButton
              :color="form.bgColor"
              @submit="onBgColorSubmit"
            />
          </div>
        </dd>
      </dl>
    </div>
    <div class="c-container__content">
      <dl>
        <dt>文字色</dt>
        <dd>
          <div class="c-container__content__colorpicker">
            <ColorPickModalWithButton
              :color="form.font.color"
              @submit="onFontColorSubmit"
            />
          </div>
        </dd>
      </dl>
    </div>
    <div class="c-container__content">
      <dl>
        <dt>文字サイズ</dt>
        <dd>
          <InputNumber
            v-model="form.font.size"
            :max="10"
            :min="0.1"
            :step="0.1"
            class="c-container__content__font_size"
          />
          rem
        </dd>
      </dl>
    </div>
    <div class="c-container__content">
      <dl>
        <dt>文字フォント</dt>
        <dd>
          <select v-model="form.font.family">
            <option v-for="fontFamily in fontFamilyList" :value="fontFamily">
              {{ fontFamily }}
            </option>
          </select>
        </dd>
      </dl>
    </div>
    <div class="c-container__content">
      <dl>
        <dt>文字の太さ</dt>
        <dd>
          <div class="c-container__content__font_weight">
            <template v-for="fontWeight in fontWeightList">
              <input
                v-model="form.font.weight"
                :id="`fontWeight--${fontWeight.value}`"
                name="fontWeight"
                type="radio"
                :value="fontWeight.value"
              />
              <label :for="`fontWeight--${fontWeight.value}`">
                {{ fontWeight.label }}
              </label>
            </template>
          </div>
        </dd>
      </dl>
    </div>
    <div class="c-container__content">
      <dl>
        <dt>ボタン位置</dt>
        <dd>
          <div class="c-container__content__button_position">
            <template v-for="position in buttonPositionList">
              <input
                v-model="form.buttonPosition"
                :id="`buttonPosition--${position.value}`"
                name="buttonPosition"
                type="radio"
                :value="position.value"
              />
              <label :for="`buttonPosition--${position.value}`">
                {{ position.label }}
              </label>
            </template>
          </div>
        </dd>
      </dl>
    </div>

    <div class="c-container__content">
      <dl>
        <dt>サンプル</dt>
        <dd>
          <div class="c-container__content__sample">
            <StopWatch
              :bgColor="form.bgColor"
              :font="form.font"
              :button="form.buttonPosition"
            />
          </div>
        </dd>
      </dl>
    </div>

    <div class="c-container__content">
      <dl>
        <dt>
          <button @click="onCreateURL">URLを生成</button>
        </dt>
        <dd>
          <div class="c-container__content__copy">
            <input readonly type="text" :value="url" />
            <BasicBalloon content="コピーしました" timming="click">
              <img
                src="/commons/icons/copy.svg"
                alt="コピー"
                class="c-container__content__copy__icon"
                @click="onCopy"
              />
            </BasicBalloon>
            <img
              src="/commons/icons/open_in_new.svg"
              alt="リンクを開く"
              class="c-container__content__copy__icon"
              @click="onMove"
            />
          </div>
        </dd>
      </dl>
    </div>
  </div>
</template>

<style scoped lang="scss">
input[type="color"],
input[type="range"],
select,
button {
  cursor: pointer;
}
.c-container {
  &__content {
    display: flex;
    align-items: center;
    gap: 0 0.8rem;
    dl {
      display: flex;
      dt {
        min-width: 8rem;
      }
      dd {
        min-width: fit-content;
        display: flex;
        align-items: center;
        gap: 0 0.4rem;
      }
    }
    + .c-container__content {
      margin-top: 0.8rem;
    }
    &__colorpicker {
      width: 2.4rem;
      height: 1.2rem;
    }
    &__font_size {
      width: 3rem;
    }
    &__font_weight,
    &__button_position {
      input[type="radio"] {
        appearance: none;
        &:checked + label {
          background-color: rgba(0, 0, 255, 0.4);
        }
      }

      label {
        cursor: pointer;
        border: 0.1rem lightgray solid;
        padding: 0.2rem 0.4rem;
      }
    }
    &__sample {
      min-width: 800px;
      padding: 0.4rem 0.8rem;
      border: 0.1rem lightgray solid;
    }
    button {
      width: 6rem;
      height: 100%;
    }
    &__copy {
      display: flex;
      &__icon {
        position: relative;
        cursor: pointer;
        vertical-align: middle;
        &:hover {
          background: #eee;
        }
      }
    }
  }
}
</style>
