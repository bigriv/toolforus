<script setup lang="ts">
import InputColor from "@/components/organisms/interfaces/InputColor.vue";
import DescriptionIcon from "@/components/molecules/icons/DescriptionIcon.vue";
import BasicButton from "@/components/atoms/interfaces/BasicButton.vue";
import ColorBalance from "@/components/atoms/designs/ColorBalance.vue";
import BasicSelect from "@/components/atoms/interfaces/BasicSelect.vue";
import BasicCheck from "@/components/atoms/interfaces/BasicCheck.vue";
import ColorList from "@/components/molecules/lists/ColorList.vue";
import { useColorCompanionSearch } from "@/composables/tools/designs/colorcompanion/search";
import { useColorScehme } from "@/composables/tools/designs/colorcompanion/scheme";
import { TOUColor } from "@/types/common/color/color";

const {
  colorTagSelections,
  colorOptions,
  selectingColor,
  suggestColorList,
  onSearchColor,
  onChangeSelectingTag,
} = useColorCompanionSearch();

// 基準色
const baseColor = ref(new TOUColor(TOUColor.CODE_WHITE, 1));
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
  <div class="c-container">
    <div class="c-container__search">
      <div class="c-container__head">検索</div>
      <div class="c-container__search__form u-mgt-1">
        <div class="c-container__search__form__head">イメージ</div>
        <div class="c-container__search__form__tags u-mgt-1">
          <div
            v-for="tag in colorTagSelections"
            class="c-container__search__form__tags__check"
            :key="tag.value"
          >
            <BasicCheck
              v-model="tag.checked"
              :label="tag.label"
              @change="(e) => onChangeSelectingTag(e, tag)"
            />
          </div>
        </div>

        <div class="c-container__search__form__head u-mgt-3">色の系統</div>
        <div class="c-container__search__form__colors u-mgt-1">
          <BasicSelect v-model="selectingColor" :options="colorOptions" />
        </div>
        <div class="c-container__search__form__button u-mgt-3">
          <BasicButton label="検索" @click="onSearchColor" />
        </div>
      </div>
      <div class="c-container__search__result u-mgt-2">
        <ColorList :colors="suggestColorList" />
      </div>
    </div>
    <div class="c-container__input u-mgt-4">
      <div class="c-container__head">基準色</div>
      <div class="c-container__input__color u-mgt-1">
        <InputColor v-model:color="baseColor" />
      </div>
    </div>
    <div class="c-container__provides u-mgt-4">
      <div v-for="provide in provides" class="c-container__provides__provide">
        <div class="c-container__provides__provide__label">
          <div class="c-container__provides__provide__label__text">
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
    <div class="c-container__schemes u-mgt-4">
      <div v-for="scheme in schemeList" class="c-container__schemes__scheme">
        <div class="c-container__schemes__scheme__label">
          <div class="c-container__schemes__scheme__label__text">
            {{ scheme.label }}
          </div>
          <DescriptionIcon icon="info" :description="scheme.description" />
        </div>
        <div class="c-container__schemes__scheme__colors u-mgt-2">
          <ColorBalance
            :balances="[
              { color: baseColor, rate: 60 },
              { color: scheme.accent, rate: 15 },
              { color: scheme.sub, rate: 25 },
            ]"
          />
          <ColorList
            :colors="[baseColor, scheme.accent, scheme.sub]"
            class="c-container__schemes__scheme__colors__color_list"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.c-container {
  &__head {
    font-weight: bold;
    font-size: 1.6rem;
    font-family: "MS Gothic", "Hiragino Sans";
    color: #555;
  }
  &__search {
    &__form {
      &__head {
        font-weight: bold;
        font-size: 1.2rem;
        font-family: "MS Gothic", "Hiragino Sans";
        color: #555;
      }
      &__tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0 1.6rem;
      }
      &__colors {
        width: 10rem;
      }
      &__button {
        width: 10rem;
      }
    }
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
