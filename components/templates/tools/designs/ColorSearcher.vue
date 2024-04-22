<script setup lang="ts">
import BasicButton from "@/components/atoms/interfaces/BasicButton.vue";
import BasicSelect from "@/components/atoms/interfaces/BasicSelect.vue";
import BasicCheck from "@/components/atoms/interfaces/BasicCheck.vue";
import ColorList from "@/components/molecules/lists/ColorList.vue";
import { useColorCompanionSearch } from "@/composables/tools/designs/colorcompanion/search";

const {
  colorTagSelections,
  colorOptions,
  selectingColor,
  suggestColorList,
  onSearchColor,
  onChangeSelectingTag,
  isSearching,
} = useColorCompanionSearch();
</script>

<template>
  <div class="c-color_search">
    <div class="c-color_search__head">検索</div>
    <div class="c-color_search__form u-mgt-1">
      <div class="c-color_search__form__head">イメージ</div>
      <div class="c-color_search__form__tags u-mgt-1">
        <div
          v-for="tag in colorTagSelections"
          class="c-color_search__form__tags__check"
          :key="tag.value"
        >
          <BasicCheck
            v-model="tag.checked"
            :label="tag.label"
            @change="(e) => onChangeSelectingTag(e, tag)"
          />
        </div>
      </div>

      <div class="c-color_search__form__head u-mgt-3">色の系統</div>
      <div class="c-color_search__form__colors u-mgt-1">
        <BasicSelect v-model="selectingColor" :options="colorOptions" />
      </div>
      <div class="c-color_search__form__button u-mgt-3">
        <BasicButton label="検索" @click="onSearchColor" />
      </div>
    </div>
    <div class="c-color_search__result u-mgt-2">
      <ColorList :colors="suggestColorList" />
      <div v-if="isSearching">検索中...</div>
      <div v-else-if="suggestColorList.length <= 0">検索結果が0件です。</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.c-color_search {
  &__head {
    font-weight: bold;
    font-size: 1.6rem;
    font-family: "MS Gothic", "Hiragino Sans";
    color: #555;
  }
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
</style>
