<script setup lang="ts">
import InputColor from "@/components/organisms/interfaces/InputColor.vue";
import CopyIcon from "@/components/molecules/icons/CopyIcon.vue";
import DescriptionIcon from "@/components/molecules/icons/DescriptionIcon.vue";
import SampleGridLayout from "@/components/organisms/tools/designs/SampleGridLayout.vue";
import { TOUPosition } from "@/types/common/position";
import { TOURGBColor } from "@/types/common/css/color";
import { TOUGridLayout } from "@/types/tools/designs/colorcompanion/layout";
import { TOUGridContent } from "@/types/tools/designs/colorcompanion/content";

// 基準色
const baseColor = ref(new TOURGBColor(TOURGBColor.CODE_WHITE, 1));
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
      colors: [TOURGBColor.getInverted(baseColor.value)],
    },
    complementary: {
      label: "補色",
      description:
        "色相環で正反対の位置関係にある色の組み合わせのこと。\nお互いの色を引き立てる効果があります。",
      colors: [TOURGBColor.getComplementary(baseColor.value)],
    },
    opposite: {
      label: "反対色",
      description:
        "色相環上で、基準となる色の両斜めに位置する色。\n基準となる色と組み合わせることでメリハリや緊張感を与えることができます。",
      colors: TOURGBColor.getOppositeColors(baseColor.value),
    },
    similar: {
      label: "類似色",
      description:
        "色相環上で、基準となる色の両隣の2色。\n基準の色と似ているため、組み合わせて使うことで安定感を表現することができます。",
      colors: TOURGBColor.getSimilarColor(baseColor.value),
    },
  };
});

// 縦長のサンプルレイアウトの定義
const vLayouts = computed(() => [
  new TOUGridLayout(9, 16, [
    new TOUGridContent({
      start: new TOUPosition(0, 0),
      end: new TOUPosition(9, 12),
      background: baseColor.value,
    }),
    new TOUGridContent({
      start: new TOUPosition(0, 12),
      end: new TOUPosition(9, 16),
      background: provides.value.opposite.colors[0],
    }),
  ]),

  new TOUGridLayout(9, 16, [
    new TOUGridContent({
      start: new TOUPosition(0, 0),
      end: new TOUPosition(9, 16),
      background: baseColor.value,
    }),
    new TOUGridContent({
      start: new TOUPosition(0, 6),
      end: new TOUPosition(9, 7),
      background: provides.value.opposite.colors[0],
    }),
  ]),

  new TOUGridLayout(9, 16, [
    new TOUGridContent({
      start: new TOUPosition(0, 0),
      end: new TOUPosition(9, 8),
      background: baseColor.value,
    }),
    new TOUGridContent({
      start: new TOUPosition(0, 8),
      end: new TOUPosition(9, 12),
      background: provides.value.opposite.colors[0],
    }),
    new TOUGridContent({
      start: new TOUPosition(0, 12),
      end: new TOUPosition(9, 16),
      background: baseColor.value,
    }),
  ]),

  new TOUGridLayout(9, 16, [
    new TOUGridContent({
      start: new TOUPosition(0, 0),
      end: new TOUPosition(9, 16),
      background: baseColor.value,
    }),
    new TOUGridContent({
      start: new TOUPosition(5, 0),
      end: new TOUPosition(16, 7),
      background: provides.value.opposite.colors[0],
    }),
    new TOUGridContent({
      start: new TOUPosition(0, 7),
      end: new TOUPosition(9, 13),
      background: provides.value.complementary.colors[0],
    }),
  ]),

  new TOUGridLayout(9, 16, [
    new TOUGridContent({
      start: new TOUPosition(0, 0),
      end: new TOUPosition(9, 16),
      background: provides.value.complementary.colors[0],
    }),
    new TOUGridContent({
      start: new TOUPosition(1, 1),
      end: new TOUPosition(8, 15),
      background: baseColor.value,
    }),
    new TOUGridContent({
      start: new TOUPosition(0, 0),
      end: new TOUPosition(9, 1),
      background: provides.value.opposite.colors[0],
    }),
    new TOUGridContent({
      start: new TOUPosition(0, 15),
      end: new TOUPosition(9, 16),
      background: provides.value.opposite.colors[0],
    }),
  ]),

  new TOUGridLayout(9, 16, [
    new TOUGridContent({
      start: new TOUPosition(0, 0),
      end: new TOUPosition(9, 16),
      background: provides.value.complementary.colors[0],
    }),
    new TOUGridContent({
      start: new TOUPosition(0, 5),
      end: new TOUPosition(9, 15),
      background: baseColor.value,
    }),
    new TOUGridContent({
      start: new TOUPosition(1, 6),
      end: new TOUPosition(4, 8),
      background: provides.value.opposite.colors[0],
    }),
    new TOUGridContent({
      start: new TOUPosition(1, 9),
      end: new TOUPosition(4, 11),
      background: provides.value.opposite.colors[0],
    }),
    new TOUGridContent({
      start: new TOUPosition(1, 12),
      end: new TOUPosition(4, 14),
      background: provides.value.opposite.colors[0],
    }),
    new TOUGridContent({
      start: new TOUPosition(5, 6),
      end: new TOUPosition(8, 8),
      background: provides.value.opposite.colors[0],
    }),
    new TOUGridContent({
      start: new TOUPosition(5, 9),
      end: new TOUPosition(8, 11),
      background: provides.value.opposite.colors[0],
    }),
    new TOUGridContent({
      start: new TOUPosition(5, 12),
      end: new TOUPosition(8, 14),
      background: provides.value.opposite.colors[0],
    }),
  ]),
]);

// 横長のサンプルレイアウトの定義
const hLayouts = computed(() => [
  new TOUGridLayout(16, 9, [
    new TOUGridContent({
      start: new TOUPosition(0, 0),
      end: new TOUPosition(12, 9),
      background: baseColor.value,
    }),
    new TOUGridContent({
      start: new TOUPosition(12, 0),
      end: new TOUPosition(16, 9),
      background: provides.value.opposite.colors[0],
    }),
  ]),

  new TOUGridLayout(16, 9, [
    new TOUGridContent({
      start: new TOUPosition(0, 0),
      end: new TOUPosition(16, 9),
      background: baseColor.value,
    }),
    new TOUGridContent({
      start: new TOUPosition(3, 1),
      end: new TOUPosition(16, 9),
      background: provides.value.opposite.colors[0],
    }),
  ]),

  new TOUGridLayout(16, 9, [
    new TOUGridContent({
      start: new TOUPosition(0, 0),
      end: new TOUPosition(16, 9),
      background: provides.value.complementary.colors[0],
    }),
    new TOUGridContent({
      start: new TOUPosition(2, 1),
      end: new TOUPosition(14, 8),
      background: baseColor.value,
    }),
    new TOUGridContent({
      start: new TOUPosition(0, 1),
      end: new TOUPosition(2, 8),
      background: provides.value.opposite.colors[0],
    }),
    new TOUGridContent({
      start: new TOUPosition(14, 1),
      end: new TOUPosition(16, 8),
      background: provides.value.opposite.colors[0],
    }),
  ]),

  new TOUGridLayout(16, 9, [
    new TOUGridContent({
      start: new TOUPosition(0, 0),
      end: new TOUPosition(16, 9),
      background: provides.value.complementary.colors[0],
    }),
    new TOUGridContent({
      start: new TOUPosition(0, 0),
      end: new TOUPosition(16, 1),
      background: baseColor.value,
    }),
    new TOUGridContent({
      start: new TOUPosition(5, 1),
      end: new TOUPosition(11, 9),
      background: provides.value.opposite.colors[0],
    }),
  ]),

  new TOUGridLayout(16, 9, [
    new TOUGridContent({
      start: new TOUPosition(0, 0),
      end: new TOUPosition(16, 9),
      background: provides.value.complementary.colors[0],
    }),
    new TOUGridContent({
      start: new TOUPosition(0, 5),
      end: new TOUPosition(5, 9),
      background: baseColor.value,
    }),
    new TOUGridContent({
      start: new TOUPosition(11, 0),
      end: new TOUPosition(16, 4),
      background: baseColor.value,
    }),
    new TOUGridContent({
      start: new TOUPosition(5, 0),
      end: new TOUPosition(11, 9),
      background: provides.value.opposite.colors[0],
    }),
  ]),

  new TOUGridLayout(16, 9, [
    new TOUGridContent({
      start: new TOUPosition(0, 0),
      end: new TOUPosition(16, 5),
      background: provides.value.complementary.colors[0],
    }),
    new TOUGridContent({
      start: new TOUPosition(0, 5),
      end: new TOUPosition(16, 9),
      background: baseColor.value,
    }),
    new TOUGridContent({
      start: new TOUPosition(1, 6),
      end: new TOUPosition(5, 8),
      background: provides.value.opposite.colors[0],
    }),
    new TOUGridContent({
      start: new TOUPosition(6, 6),
      end: new TOUPosition(10, 8),
      background: provides.value.opposite.colors[0],
    }),
    new TOUGridContent({
      start: new TOUPosition(11, 6),
      end: new TOUPosition(15, 8),
      background: provides.value.opposite.colors[0],
    }),
  ]),
]);
</script>

<template>
  <div class="c-container">
    <div class="c-container__input">
      <div class="c-container__input__text">基準色</div>
      <div class="c-container__input__color">
        <InputColor v-model:color="baseColor" />
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
    <div class="c-container__samples">
      <section>
        <div class="c-container__samples__title">レイアウトサンプル(縦長)</div>
        <div class="c-container__samples__layouts">
          <div
            v-for="layout in vLayouts"
            class="c-container__samples__layouts__content c-container__samples__layouts__content--vertical"
          >
            <SampleGridLayout :layout="layout" />
          </div>
        </div>
      </section>
      <section>
        <div class="c-container__samples__title">レイアウトサンプル(横長)</div>
        <div class="c-container__samples__layouts">
          <div
            v-for="layout in hLayouts"
            class="c-container__samples__layouts__content c-container__samples__layouts__content--horizontal"
          >
            <SampleGridLayout :layout="layout" />
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped lang="scss">
.c-container {
  &__input {
    position: sticky;
    top: 0;
    background: white;
    z-index: 1;
    &__text {
      font-weight: bold;
      font-size: 1.6rem;
      font-family: "MS Gothic", "Hiragino Sans";
      color: #555;
    }
    &__color {
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
          transition:
            background 0.4s ease,
            opacity 0.4s ease;
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
  &__samples {
    margin-top: 1.6rem;
    section + section {
      margin-top: 0.8rem;
    }
    &__title {
      font-weight: bold;
      font-size: 1.6rem;
      font-family: "MS Gothic", "Hiragino Sans";
      color: #555;
    }
    &__layouts {
      display: flex;
      flex-wrap: wrap;
      gap: 0.8rem;
      margin-top: 0.4rem;
      &__content {
        &--vertical {
          width: 8rem;
          aspect-ratio: 0.56;
        }
        &--horizontal {
          width: 16.8rem;
          aspect-ratio: 1.78;
        }
      }
    }
  }
}
</style>
