<script setup lang="ts">
import InputColorToolButton from "@/components/organisms/interfaces/InputColorToolButton.vue";
import InputNumber from "@/components/molecules/interfaces/InputNumber.vue";
import { TOUColor } from "@/types/common/color/color";

const props = defineProps<{
  fill: TOUColor;
  border: TOUColor;
  borderWidth: number;
}>();

const emits = defineEmits<{
  "update:fill": [v: TOUColor];
  "update:border": [v: TOUColor];
  "update:borderWidth": [v: number];
  "color-open": [];
  "color-cancel": [];
}>();

const fill = computed({
  get: () => props.fill,
  set: (v) => emits("update:fill", v),
});

const border = computed({
  get: () => props.border,
  set: (v) => emits("update:border", v),
});

const borderWidth = computed({
  get: () => props.borderWidth,
  set: (v) => emits("update:borderWidth", v),
});
</script>

<template>
  <div class="c-section">
    <div class="c-section__title">図形</div>
    <div class="c-section__row">
      <span class="c-section__label">塗り</span>
      <InputColorToolButton
        v-model:color="fill"
        icon="/commons/icons/colors.svg"
        label="図形の塗りつぶし色"
        @open="emits('color-open')"
        @cancel="emits('color-cancel')"
      />
    </div>
    <div class="c-section__row">
      <span class="c-section__label">枠線色</span>
      <InputColorToolButton
        v-model:color="border"
        icon="/commons/icons/pen.svg"
        label="図形の枠線色"
        @open="emits('color-open')"
        @cancel="emits('color-cancel')"
      />
    </div>
    <div class="c-section__row">
      <span class="c-section__label">枠線太さ</span>
      <div class="c-section__input">
        <InputNumber v-model="borderWidth" :min="0" :max="100" mode="uint" />
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
