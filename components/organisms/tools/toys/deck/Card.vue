<script setup lang="ts">
const props = defineProps({
  facedown: {
    type: Boolean,
    default: false,
  },
  edit: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    default: "",
  },
  tag: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
});

const emits = defineEmits(["update:name", "update:tag", "update:description"]);

const name = computed({
  get: () => props.name,
  set: (newValue) => emits("update:name", newValue),
});
const tag = computed({
  get: () => props.tag,
  set: (newValue) => emits("update:tag", newValue),
});
const description = computed({
  get: () => props.description,
  set: (newValue) => emits("update:description", newValue),
});
</script>

<template>
  <div class="c-deck_card">
    <template v-if="props.facedown">
      <div class="c-deck_card__backside"></div>
    </template>
    <template v-else-if="props.edit">
      <input
        type="text"
        v-model="name"
        placeholder="カード名"
        class="c-deck_card__name"
      />
      <input
        type="text"
        v-model="tag"
        placeholder="タグ"
        class="c-deck_card__tag"
      />
      <textarea
        v-model="description"
        placeholder="説明文"
        class="c-deck_card__description"
      />
    </template>
    <template v-else>
      <span class="c-deck_card__name">
        {{ props.name }}
      </span>
      <span class="c-deck_card__tag">
        {{ props.tag }}
      </span>
      <span class="c-deck_card__description">
        {{ props.description }}
      </span>
    </template>
  </div>
</template>

<style scoped lang="scss">
.c-deck_card {
  width: 180px;
  height: 210px;
  border: 1px solid black;
  border-radius: 5px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 1px 1px 4px black;
  background: repeating-linear-gradient(
    -45deg,
    #ffffff 40px,
    #dfdfdf 60px,
    #ffffff 80px
  );
  &__name,
  &__tag,
  &__description {
    height: 100%;
    width: 160px;
    font-family: "Shippori Antique B1";
    font-size: 14px;
    padding: 0 5px;
    background: #ffffff;
    border: 4px double black;
    box-shadow: inset 0px 0px 2px black;
  }
  &__name,
  &__tag {
    height: 44px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  &__tag {
    text-align: right;
  }
  &__description {
    line-height: 1;
    font-size: 12px;
    padding: 2px 5px;
    resize: none;
    overflow-wrap: break-word;
  }
  &__backside {
    height: 100%;
    border: 4px solid gold;
    background: linear-gradient(-30deg, #ff6a6a 15%, #514eff 60%, #39ff4d 100%);
  }
}
</style>
