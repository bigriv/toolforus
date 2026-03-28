<script setup lang="ts">
import InputColorToolButton from "@/components/organisms/interfaces/InputColorToolButton.vue";
import InputNumber from "@/components/molecules/interfaces/InputNumber.vue";
import { TOUColor } from "@/types/common/color/color";

const props = defineProps<{
  color: TOUColor;
  size: number;
}>();

const emits = defineEmits<{
  "update:color": [v: TOUColor];
  "update:size": [v: number];
}>();

const color = computed({
  get: () => props.color,
  set: (v) => emits("update:color", v),
});

const size = computed({
  get: () => props.size,
  set: (v) => emits("update:size", v),
});
</script>

<template>
  <div class="c-section">
    <div class="c-section__title">ペン設定</div>
    <div class="c-section__row">
      <span class="c-section__label">色</span>
      <InputColorToolButton
        v-model:color="color"
        icon="/commons/icons/pen.svg"
        label="ペンの色"
      />
    </div>
    <div class="c-section__row">
      <span class="c-section__label">太さ</span>
      <div class="c-section__input">
        <InputNumber v-model="size" :min="1" :max="100" mode="uint" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.c-section {
  border-bottom: 0.1rem solid #eee;
  padding: 0.5rem;

  &__title {
    font-size: 0.7rem;
    font-weight: bold;
    color: #555;
    margin-bottom: 0.4rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  &__row {
    display: flex;
    align-items: center;
    margin-bottom: 0.35rem;
    gap: 0.3rem;
    min-height: 1.6rem;
  }

  &__label {
    font-size: 0.68rem;
    width: 3.2rem;
    flex-shrink: 0;
    color: #444;
    white-space: nowrap;
  }

  &__input {
    flex: 1;
    min-width: 0;
  }
}
</style>
