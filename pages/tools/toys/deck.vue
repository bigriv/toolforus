<script setup lang="ts">
import DeckEdit from "~/components/templates/tools/toys/DeckEdit.vue";
import DeckPlaying from "~/components/templates/tools/toys/DeckPlaying.vue";
import { useTOUHead } from "~/composables/common/head";
import { FormatHelper } from "~/helpers/format";
import { LocalStorageHelper } from "~/helpers/localStorage";
import { LOCAL_STORAGE_KEY } from "~/types/common/constant/localStorage";
import { IdUtils } from "~/types/common/id";
import type { DeckCard, DeckEditingCard } from "~/types/tools/toys/deck/deck";

useTOUHead({
  title: "デッキディール",
  description: "オリジナルのカードを作って遊びましょう。",
});

const uuid = IdUtils.generateUuid();
const tabs = [
  { label: "デッキ作成", value: "edit-deck" },
  { label: "遊ぶ", value: "play" },
];
const currentTab = ref("edit-deck");
const onChangeTab = () => {
  if (currentTab.value !== "play") {
    return;
  }
};

const editingDeck: Ref<DeckEditingCard[]> = ref([
  {
    name: "",
    tag: "",
    description: "",
    quantity: 1,
    hide: false,
  },
]);

const playing: Ref<{
  deck: DeckCard[];
  field: DeckCard[];
  discard: DeckCard[];
}> = ref({
  deck: [],
  field: [],
  discard: [],
});

const originDeck = computed(() =>
  editingDeck.value.reduce((acc: Array<DeckCard>, card: DeckEditingCard) => {
    for (let i = 0; i < card.quantity; i++) {
      acc.push({
        name: card.name,
        tag: card.tag,
        description: card.description,
      });
    }
    return acc;
  }, new Array<DeckCard>())
);

const save = () =>
  LocalStorageHelper.save(LOCAL_STORAGE_KEY.TOYS.DECK, editingDeck.value);

watch(() => editingDeck.value, save, { deep: true });
const whole: Ref<HTMLElement | null> = ref(null);
const wholeWidth = ref(0);

const resize = () => {
  if (!whole.value) {
    return;
  }
  wholeWidth.value = whole.value.clientWidth;
};

onMounted(() => {
  const loadedObeject = LocalStorageHelper.load(LOCAL_STORAGE_KEY.TOYS.DECK);
  if (
    FormatHelper.isCorrectArray<DeckEditingCard>(loadedObeject, {
      name: FormatHelper.isString,
      tag: FormatHelper.isString,
      description: FormatHelper.isString,
      quantity: FormatHelper.isNumber,
      hide: FormatHelper.isBoolean,
    })
  ) {
    editingDeck.value = loadedObeject;
  }

  resize();
  window.addEventListener("resize", resize);
});
onBeforeUnmount(() => {
  window.removeEventListener("resize", resize);
});
</script>

<template>
  <div ref="whole" class="c-deck">
    <div class="c-deck__tabs">
      <label
        v-for="(tab, index) in tabs"
        :key="index"
        :class="{ 'c-deck__tabs--selected': tab.value === currentTab }"
      >
        {{ tab.label }}
        <input
          v-model="currentTab"
          type="radio"
          :name="`deck_tabs_${uuid}`"
          :value="tab.value"
          @change="onChangeTab"
        />
      </label>
    </div>
    <DeckEdit
      v-if="currentTab === 'edit-deck'"
      v-model:deck="editingDeck"
      class="u-mgt-2"
    />
    <DeckPlaying
      v-else="currentTab === 'play'"
      v-model:playing="playing"
      :deck="originDeck"
      :parent-width="wholeWidth"
      class="u-mgt-2"
    />
  </div>
</template>

<style scoped lang="scss">
.c-deck {
  &__tabs {
    display: flex;
    label {
      cursor: pointer;
      position: relative;
      width: 100px;
      text-align: center;
      opacity: 0.6;
      &:hover {
        opacity: 0.8;
      }
      > input[type="radio"] {
        display: none;
        appearance: none;
      }
    }
    &--selected {
      opacity: 1 !important;
      &::before {
        content: "";
        position: absolute;
        left: 10%;
        bottom: 0;
        width: 80%;
        height: 1px;
        background-color: black;
      }
    }
  }
}
</style>
