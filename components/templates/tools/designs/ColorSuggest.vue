<script setup lang="ts">
import ColorPicker from "@/components/molecules/interfaces/ColorPicker.vue";
import CopyIcon from "@/components/molecules/icons/CopyIcon.vue";
import DescriptionIcon from "@/components/molecules/icons/DescriptionIcon.vue";
import { TOURGBColor } from "@/types/common/css/color";

// 基準色
const baseColor = ref(new TOURGBColor(TOURGBColor.CODE_BLACK, 1));
const provides: ComputedRef<{
  [key: string]: {
    label: string;
    description: string;
    colors: TOURGBColor[];
  };
}> = computed(() => {
  return {
    inverted: {
      label: "反転色",
      description: "基準となる色のRGB値を反転させた色。",
      colors: [getInverted(baseColor.value)],
    },
    complementary: {
      label: "補色",
      description:
        "色相環で正反対の位置関係にある色の組み合わせのこと。\nお互いの色を引き立てる効果があります。",
      colors: [getComplementary(baseColor.value)],
    },
    opposite: {
      label: "反対色",
      description:
        "色相環上で、基準となる色の両斜めに位置する色。\n基準となる色と組み合わせることでメリハリや緊張感を与えることができます。",
      colors: getOppositeColors(baseColor.value),
    },
    similar: {
      label: "類似色",
      description:
        "色相環上で、基準となる色の両隣の2色。\n基準の色と似ているため、組み合わせて使うことで安定感を表現することができます。",
      colors: getSimilarColor(baseColor.value),
    },
  };
});

/**
 * 補色の取得
 * RGB値の最小値と最大値の和を取得し、その値からRGBの各値を減算することで新しいRGB値を算出する。
 * @param color 基準色
 * @returns 補色
 */
const getComplementary = (color: TOURGBColor): TOURGBColor => {
  const r = color.getRed();
  const g = color.getGreen();
  const b = color.getBlue();
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const standard = max + min;
  return new TOURGBColor(
    TOURGBColor.numberToCode(standard - r, standard - g, standard - b),
    color.opacity
  );
};

/**
 * 反転色を取得する
 * 255からRGBの各値を減算することで新しいRGB値を算出する。
 * @param color 基準色
 * @returns 反転色
 */
const getInverted = (color: TOURGBColor): TOURGBColor => {
  return new TOURGBColor(
    TOURGBColor.numberToCode(
      255 - color.getRed(),
      255 - color.getGreen(),
      255 - color.getBlue()
    ),
    color.opacity
  );
};

/**
 * 反対色を取得する
 * RGB値からHSV値に変換⇒H値に±8した値を取得⇒RGB値に戻す
 * @param color 基準色
 * @returns 反対色のリスト
 */
const getOppositeColors = (color: TOURGBColor): TOURGBColor[] => {
  const hsb = color.hsba();
  const shiftMinus = hsb.shiftHue(-8);
  const shiftPlus = hsb.shiftHue(8);
  return [shiftMinus.rgba(), shiftPlus.rgba()];
};

/**
 * 類似色を取得する
 * RGB値からHSV値に変換⇒H値に±1した値を取得⇒RGB値に戻す
 * @param color 基準色
 * @returns 類似色のリスト
 */
const getSimilarColor = (color: TOURGBColor): TOURGBColor[] => {
  const hsb = color.hsba();
  const shiftMinus = hsb.shiftHue(-1);
  const shiftPlus = hsb.shiftHue(1);
  return [shiftMinus.rgba(), shiftPlus.rgba()];
};
</script>

<template>
  <div class="c-container">
    <div class="c-container__input">
      <div class="c-container__input__text">基準色</div>
      <div class="c-container__input__picker">
        <ColorPicker v-model:color="baseColor" />
      </div>
    </div>
    <div class="c-container__provides">
      <div v-for="provide in provides" class="c-container__provides__provide">
        <div class="c-container__provides__provide__label">
          <div class="c-container__provides__provide__label__text">
            {{ provide.label }}
          </div>
          <DescriptionIcon icon="info" :description="provide.description" />
        </div>
        <template v-if="provide.colors">
          <div
            v-for="color in provide.colors"
            class="c-container__provides__provide__color"
          >
            <i
              :style="{
                background: color.code,
                opacity: color.opacity,
              }"
            />
            <div class="c-container__provides__provide__color__detail">
              <div class="c-container__provides__provide__color__detail__code">
                16進数: {{ color.code }}
                <div
                  class="c-container__provides__provide__color__detail__copy"
                >
                  <CopyIcon :content="color.code" />
                </div>
              </div>
              <div class="c-container__provides__provide__color__detail__rgb">
                RGB: {{ color.getRed() }}, {{ color.getGreen() }},
                {{ color.getBlue() }}
              </div>
              <div
                class="c-container__provides__provide__color__detail__opacity"
              >
                不透明度: {{ color.opacity * 100 }}%
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
    <div class="c-container__samples"></div>
  </div>
</template>

<style scoped lang="scss">
.c-container {
  &__input {
    position: relative;
    &__text {
      font-weight: bold;
      font-size: 1.6rem;
      font-family: "MS Gothic", "Hiragino Sans";
      color: #555;
    }
    &__picker {
      margin-top: 0.4rem;
    }
  }
  &__provides {
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem;
    margin-top: 1.6rem;
    &__provide {
      &__label {
        display: flex;
        &__text {
          font-weight: bold;
          font-size: 1.6rem;
          font-family: "MS Gothic", "Hiragino Sans";
          color: #555;
        }
      }
      &__color {
        position: relative;
        margin-top: 0.4rem;
        i {
          display: block;
          width: 8rem;
          height: 8rem;
          border: 0.1rem lightgray solid;
        }
        &__detail {
          font-size: 0.8rem;
          &__code {
            display: flex;
            align-items: center;
          }
          &__copy {
            width: 1.4em;
            height: 1.4em;
          }
        }
      }
    }
  }
}
</style>
