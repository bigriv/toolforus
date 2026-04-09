<script setup lang="ts">
import BasicButton from "~/components/atoms/interfaces/BasicButton.vue";
import InputNumber from "~/components/molecules/interfaces/InputNumber.vue";
import Card from "~/components/organisms/tools/toys/deck/Card.vue";
import type { DeckEditingCard } from "~/types/tools/toys/deck/deck";

const props = defineProps({
  deck: {
    type: Array<DeckEditingCard>,
    default: () => {},
  },
});

const emits = defineEmits(["update:deck", "save"]);

const editingDeck = computed({
  get: () => props.deck,
  set: (newValue) => emits("update:deck", newValue),
});

const onDeleteCard = (index: number) => {
  editingDeck.value.splice(index, 1);
};
const onAddCard = () => {
  editingDeck.value.push({
    name: "",
    tag: "",
    description: "",
    quantity: 1,
    hide: false,
  });
};
</script>

<template>
  <div class="c-deck_edit">
    <div class="c-deck_edit__forms">
      <div
        v-for="(card, index) in editingDeck"
        :key="index"
        class="c-deck_edit__forms__form u-mgt-2"
      >
        <Card
          v-model:name="card.name"
          v-model:tag="card.tag"
          v-model:description="card.description"
          :facedown="card.hide"
          edit
        />
        <div class="c-deck_edit__forms__form__actions">
          <div class="c-deck_edit__forms__form__quantity">
            <InputNumber
              v-model="card.quantity"
              :step="1"
              class="c-deck_edit__forms__form__quantity__input"
            />
            枚
          </div>
          <label class="c-deck_edit__forms__form__hide">
            <img v-if="card.hide" src="/commons/icons/visibility.svg" />
            <img v-else src="/commons/icons/visibility_off.svg" />
            <input type="checkbox" v-model="card.hide" />
          </label>
          <BasicButton
            label="削除"
            class="c-deck_edit__forms__form__actions__button"
            @click="onDeleteCard(index)"
          />
        </div>
      </div>
    </div>
    <BasicButton
      label="カードを追加"
      class="c-deck_edit__button u-mgt-2"
      @click="onAddCard"
    />
  </div>
</template>

<style scoped lang="scss">
.c-deck_edit {
  &__forms {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
    &__form {
      display: flex;
      flex-direction: column;
      gap: 10px;
      width: 180px;
      + .c-deck_edit {
        margin-top: 20px;
      }
      &__actions {
        display: flex;
        gap: 20px;
        align-items: center;
        justify-content: space-between;
        &__button {
          width: 60px;
        }
      }
      &__quantity {
        display: flex;
        gap: 5px;
        width: 100px;
        align-items: center;
      }
      &__hide {
        display: contents;
        > input[type="checkbox"] {
          appearance: none;
          display: none;
        }
      }
    }
  }
  &__button {
    width: 100px;
  }
}
</style>
