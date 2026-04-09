<script setup lang="ts">
import type { PropType } from "vue";
import BasicBalloon from "~/components/atoms/BasicBalloon.vue";
import BasicButton from "~/components/atoms/interfaces/BasicButton.vue";
import Card from "~/components/organisms/tools/toys/deck/Card.vue";
import Tooltip from "~/components/organisms/tools/toys/deck/Tooltip.vue";
import { JsonUtils } from "~/types/common/json";
import { DeckAreaType, type DeckCard } from "~/types/tools/toys/deck/deck";

const props = defineProps({
  deck: {
    type: Array<DeckCard>,
    default: () => [],
  },
  playing: {
    type: Object as PropType<{
      deck: DeckCard[];
      field: DeckCard[];
      discard: DeckCard[];
    }>,
    required: true,
  },
  parentWidth: {
    type: Number,
    required: true,
  },
});

const emits = defineEmits(["update:playing"]);

const playing = computed({
  get: () => props.playing,
  set: (newValue) => emits("update:playing", newValue),
});

const isShowDeckTooltip = ref(false);
const isShowFieldTooltip = ref(false);
const isShowDiscardTooltip = ref(false);
const actionList: Ref<{ label: string; action: () => void }[]> = ref([]);

const showActions = (type: DeckAreaType, index: number) => {
  isShowDeckTooltip.value = false;
  isShowFieldTooltip.value = false;
  isShowDiscardTooltip.value = false;

  switch (type) {
    case DeckAreaType.DECK:
      actionList.value = [
        {
          label: "場に出す",
          action: () => {
            const card = playing.value.deck.splice(index, 1);
            playing.value.field.push(...card);
            isShowDeckTooltip.value = false;
          },
        },
        {
          label: "捨て札にする",
          action: () => {
            const card = playing.value.deck.splice(index, 1);
            playing.value.discard.push(...card);
            isShowDeckTooltip.value = false;
          },
        },
        {
          label: "山札の上に戻す",
          action: () => {
            const card = playing.value.deck.splice(index, 1);
            playing.value.deck.unshift(...card);
            isShowDeckTooltip.value = false;
          },
        },
        {
          label: "山札の下に戻す",
          action: () => {
            const card = playing.value.deck.splice(index, 1);
            playing.value.deck.push(...card);
            isShowDeckTooltip.value = false;
          },
        },
      ];
      isShowDeckTooltip.value = true;
      return;
    case DeckAreaType.FIELD:
      actionList.value = [
        {
          label: "捨て札にする",
          action: () => {
            const card = playing.value.field.splice(index, 1);
            playing.value.discard.push(...card);
            isShowFieldTooltip.value = false;
          },
        },
        {
          label: "山札の上に戻す",
          action: () => {
            const card = playing.value.field.splice(index, 1);
            playing.value.deck.unshift(...card);
            isShowFieldTooltip.value = false;
          },
        },
        {
          label: "山札の下に戻す",
          action: () => {
            const card = playing.value.field.splice(index, 1);
            playing.value.deck.push(...card);
            isShowFieldTooltip.value = false;
          },
        },
      ];
      isShowFieldTooltip.value = true;
      return;
    case DeckAreaType.DISCARD:
      actionList.value = [
        {
          label: "場に出す",
          action: () => {
            const card = playing.value.discard.splice(index, 1);
            playing.value.field.push(...card);
            isShowDiscardTooltip.value = false;
          },
        },
        {
          label: "山札の上に戻す",
          action: () => {
            const card = playing.value.discard.splice(index, 1);
            playing.value.deck.unshift(...card);
            isShowDiscardTooltip.value = false;
          },
        },
        {
          label: "山札の下に戻す",
          action: () => {
            const card = playing.value.discard.splice(index, 1);
            playing.value.deck.push(...card);
            isShowDiscardTooltip.value = false;
          },
        },
      ];
      isShowDiscardTooltip.value = true;
      return;
  }
};

const reset = () => {
  playing.value.discard = [];
  playing.value.field = [];
  playing.value.deck = shuffle(JsonUtils.deepCopy(props.deck));
};

const shuffle = (cards: DeckCard[]) => {
  const tempArray = [...cards];
  for (let i = tempArray.length - 1; i > 0; i--) {
    // ランダムなインデックスを生成
    const j = Math.floor(Math.random() * (i + 1));

    // i番目とj番目の要素を交換
    [tempArray[i], tempArray[j]] = [tempArray[j], tempArray[i]];
  }
  return tempArray;
};

const playingZone: Ref<HTMLElement | null> = ref(null);
const palyingZoneScale = ref(1);

const resize = () => {
  if (!props.parentWidth) {
    return;
  }
  if (!playingZone.value) {
    return;
  }
  const playingZoneWidth = playingZone.value.clientWidth;
  if (!playingZoneWidth) {
    return;
  }
  if (props.parentWidth >= 410) {
    palyingZoneScale.value = 1;
    return;
  }
  palyingZoneScale.value = props.parentWidth / playingZoneWidth;
};

watch(
  () => props.parentWidth,
  () => {
    resize();
  }
);
onMounted(() => {
  resize();
});
</script>

<template>
  <div class="c-deck_playing">
    <div class="c-deck_playing__actions">
      <BasicBalloon timming="click" content="リセットしました。">
        <BasicButton
          label="リセット"
          
          class="c-deck_playing__actions__button"
          @click="reset"
        />
      </BasicBalloon>
    </div>
    <div
      ref="playingZone"
      class="c-deck_playing__zone u-mgt-2"
      :style="{ '--scale': palyingZoneScale }"
    >
      <div class="c-deck_playing__zone__field">
        <span class="c-deck_playing__zone__field__label">場</span>
        <Card
          v-if="playing.field.length > 0"
          :name="playing.field[playing.field.length - 1].name"
          :tag="playing.field[playing.field.length - 1].tag"
          :description="playing.field[playing.field.length - 1].description"
          class="c-deck_playing__zone__field__card"
          @click="showActions(DeckAreaType.FIELD, playing.field.length - 1)"
        />
        <Tooltip
          v-model:is-show="isShowFieldTooltip"
          :actions="actionList"
          place="below"
        />
      </div>
      <div class="c-deck_playing__zone__deck">
        <span class="c-deck_playing__zone__deck__label">山札</span>
        <Card
          v-if="playing.deck.length > 0"
          facedown
          class="c-deck_playing__zone__deck__card"
          @click="showActions(DeckAreaType.DECK, 0)"
        />
        <Tooltip
          v-model:is-show="isShowDeckTooltip"
          :actions="actionList"
          place="right"
        />
      </div>
      <div class="c-deck_playing__zone__discard">
        <span class="c-deck_playing__zone__discard__label">捨て札</span>
        <Card
          v-if="playing.discard.length > 0"
          :name="playing.discard[playing.discard.length - 1].name"
          :tag="playing.discard[playing.discard.length - 1].tag"
          :description="playing.discard[playing.discard.length - 1].description"
          class="c-deck_playing__zone__discard__card"
          @click="showActions(DeckAreaType.DISCARD, playing.discard.length - 1)"
        />
        <Tooltip
          v-model:is-show="isShowDiscardTooltip"
          :actions="actionList"
          place="left"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.c-deck_playing {
  &__actions {
    &__button {
      width: 100px;
    }
  }
  &__zone {
    width: fit-content;
    display: grid;
    grid-template-columns: 200px 200px;
    grid-template-rows: 250px 250px;
    gap: 10px;
    transform: scale(var(--scale));
    transform-origin: 0% 0%;
    &__field {
      grid-column: 1 / 3;
      grid-row: 1 / 2;
      position: relative;
      border: 1px solid black;
      padding: 10px;
      &__label {
        position: absolute;
        top: 5px;
        left: 50%;
        transform: translateX(-50%);
      }
      &__card {
        position: absolute;
        top: 30px;
        left: 50%;
        transform: translateX(-50%);
      }
    }
    &__deck {
      grid-column: 1 / 2;
      grid-row: 2 / 3;
      position: relative;
      border: 1px solid black;
      &__label {
        position: absolute;
        top: 5px;
        left: 50%;
        transform: translateX(-50%);
      }
      &__card {
        position: absolute;
        top: 30px;
        left: 50%;
        transform: translateX(-50%);
      }
    }
    &__discard {
      grid-row: 2 / 3;
      grid-column: 2 / 3;
      position: relative;
      border: 1px solid black;
      &__label {
        position: absolute;
        top: 5px;
        left: 50%;
        transform: translateX(-50%);
      }
      &__card {
        position: absolute;
        top: 30px;
        left: 50%;
        transform: translateX(-50%);
      }
    }
  }
}
</style>
