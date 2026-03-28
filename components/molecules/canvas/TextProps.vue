<script setup lang="ts">
import InputColorToolButton from "@/components/organisms/interfaces/InputColorToolButton.vue";
import InputNumber from "@/components/molecules/interfaces/InputNumber.vue";
import ToolInputText from "@/components/molecules/interfaces/ToolInputText.vue";
import { TOUColor } from "@/types/common/color/color";

const props = defineProps<{
  text: string;
  size: number;
  color: TOUColor;
  stroke: TOUColor;
  strokeWidth: number;
}>();

const emits = defineEmits<{
  "update:text": [v: string];
  "update:size": [v: number];
  "update:color": [v: TOUColor];
  "update:stroke": [v: TOUColor];
  "update:strokeWidth": [v: number];
  "change-text": [v: string];
  "color-open": [];
  "color-cancel": [];
}>();

const text = computed({
  get: () => props.text,
  set: (v) => emits("update:text", v),
});

const size = computed({
  get: () => props.size,
  set: (v) => emits("update:size", v),
});

const color = computed({
  get: () => props.color,
  set: (v) => emits("update:color", v),
});

const stroke = computed({
  get: () => props.stroke,
  set: (v) => emits("update:stroke", v),
});

const strokeWidth = computed({
  get: () => props.strokeWidth,
  set: (v) => emits("update:strokeWidth", v),
});
</script>

<template>
  <div class="c-section">
    <div class="c-section__title">テキスト</div>
    <div class="c-section__row">
      <div class="c-section__input--full">
        <ToolInputText
          v-model="text"
          placeholder="テキスト"
          :maxlength="100"
          icon="/commons/icons/title.svg"
          label="テキスト"
          @update:modelValue="emits('change-text', $event)"
        />
      </div>
    </div>
    <div class="c-section__row">
      <span class="c-section__label">サイズ</span>
      <div class="c-section__input">
        <InputNumber v-model="size" :min="6" :max="200" mode="uint" />
      </div>
    </div>
    <div class="c-section__row">
      <span class="c-section__label">文字色</span>
      <InputColorToolButton
        v-model:color="color"
        icon="/commons/icons/colors.svg"
        label="テキストの塗りつぶし色"
        @open="emits('color-open')"
        @cancel="emits('color-cancel')"
      />
    </div>
    <div class="c-section__row">
      <span class="c-section__label">枠線色</span>
      <InputColorToolButton
        v-model:color="stroke"
        icon="/commons/icons/pen.svg"
        label="テキストの枠線色"
        @open="emits('color-open')"
        @cancel="emits('color-cancel')"
      />
    </div>
    <div class="c-section__row">
      <span class="c-section__label">枠線太さ</span>
      <div class="c-section__input">
        <InputNumber v-model="strokeWidth" :min="0" :max="100" mode="uint" />
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

    &--full {
      width: 100%;
      min-width: 0;
    }
  }
}
</style>
