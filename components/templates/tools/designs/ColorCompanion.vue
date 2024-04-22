<script setup lang="ts">
import InputColor from "@/components/organisms/interfaces/InputColor.vue";
import DescriptionIcon from "@/components/molecules/icons/DescriptionIcon.vue";
import ColorBalance from "@/components/atoms/designs/ColorBalance.vue";
import ColorList from "@/components/molecules/lists/ColorList.vue";
import { useColorScehme } from "@/composables/tools/designs/colorcompanion/scheme";
import { TOUColor } from "@/types/common/color/color";

const props = defineProps({
  baseColor: {
    type: TOUColor,
    default: new TOUColor(TOUColor.CODE_WHITE, 1),
  },
});

// 基準色
const baseColor = ref(props.baseColor);
const provides: ComputedRef<{
  [key: string]: {
    label: string;
    description: string;
    colors: TOUColor[];
  };
}> = computed(() => {
  return {
    inverted: {
      label: "反転色",
      description: "基準となる色のRGB値を反転させた色。",
      colors: [baseColor.value.getInverted()],
    },
    complementary: {
      label: "補色",
      description:
        "色相環で正反対の位置関係にある色の組み合わせのこと。\nお互いの色を引き立てる効果があります。",
      colors: [baseColor.value.getComplementary()],
    },
    opposite: {
      label: "反対色",
      description:
        "色相環上で、基準となる色の両斜めに位置する色。\n基準となる色と組み合わせることでメリハリや緊張感を与えることができます。",
      colors: baseColor.value.getOppositeColors(),
    },
    similar: {
      label: "類似色",
      description:
        "色相環上で、基準となる色の両隣の2色。\n基準の色と似ているため、組み合わせて使うことで安定感を表現することができます。",
      colors: baseColor.value.getSimilarColors(),
    },
  };
});

const { schemeList } = useColorScehme(baseColor);
</script>

<template>
  <div class="c-color_companion">
    <div class="c-color_companion__input">
      <div class="c-color_companion__head">基準色</div>
      <div class="c-color_companion__input__color u-mgt-1">
        <InputColor v-model:color="baseColor" />
      </div>
    </div>
    <div class="c-color_companion__provides u-mgt-4">
      <div
        v-for="provide in provides"
        class="c-color_companion__provides__provide"
      >
        <div class="c-color_companion__provides__provide__label">
          <div class="c-color_companion__provides__provide__label__text">
            {{ provide.label }}
          </div>
          <DescriptionIcon icon="info" :description="provide.description" />
        </div>
        <ColorList
          v-if="provide.colors"
          :colors="provide.colors"
          :row="1"
          class="u-mgt-2"
        />
      </div>
    </div>
    <div class="c-color_companion__schemes u-mgt-4">
      <div
        v-for="scheme in schemeList"
        class="c-color_companion__schemes__scheme"
      >
        <div class="c-color_companion__schemes__scheme__label">
          <div class="c-color_companion__schemes__scheme__label__text">
            {{ scheme.label }}
          </div>
          <DescriptionIcon icon="info" :description="scheme.description" />
        </div>
        <div class="c-color_companion__schemes__scheme__colors u-mgt-2">
          <ColorBalance
            :balances="[
              { color: baseColor, rate: 60 },
              { color: scheme.accent, rate: 15 },
              { color: scheme.sub, rate: 25 },
            ]"
          />
          <ColorList
            :colors="[baseColor, scheme.accent, scheme.sub]"
            class="c-color_companion__schemes__scheme__colors__color_list"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.c-color_companion {
  &__head {
    font-weight: bold;
    font-size: 1.6rem;
    font-family: "MS Gothic", "Hiragino Sans";
    color: #555;
  }
  &__input {
    position: sticky;
    top: 0;
    background: white;
    z-index: 1;
  }
  &__provides {
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem;
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
    }
  }
  &__schemes {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    &__scheme {
      &__label {
        display: flex;
        &__text {
          font-weight: bold;
          font-size: 1.6rem;
          font-family: "MS Gothic", "Hiragino Sans";
          color: #555;
        }
      }
      &__colors {
        display: flex;
        gap: 1.6rem;
        flex-wrap: wrap;
        &__color_list {
          width: fit-content;
        }
      }
    }
  }
}
</style>
