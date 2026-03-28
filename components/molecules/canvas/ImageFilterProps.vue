<script setup lang="ts">
import InputSlideAndNumber from "@/components/molecules/interfaces/InputSlideAndNumber.vue";
import ToolButton from "@/components/atoms/interfaces/ToolButton.vue";

const props = defineProps<{
  contrast: number;
  brightness: number;
  saturation: number;
  hueRotation: number;
  blur: number;
  opacity: number;
  isProcessing?: boolean;
  errorMessage?: string;
}>();

const emits = defineEmits<{
  "update:contrast": [v: number];
  "update:brightness": [v: number];
  "update:saturation": [v: number];
  "update:hue-rotation": [v: number];
  "update:blur": [v: number];
  "update:opacity": [v: number];
  "crop-start": [];
  "remove-background": [];
}>();

const contrast = computed({ get: () => props.contrast, set: (v) => emits("update:contrast", v) });
const brightness = computed({ get: () => props.brightness, set: (v) => emits("update:brightness", v) });
const saturation = computed({ get: () => props.saturation, set: (v) => emits("update:saturation", v) });
const hueRotation = computed({ get: () => props.hueRotation, set: (v) => emits("update:hue-rotation", v) });
const blur = computed({ get: () => props.blur, set: (v) => emits("update:blur", v) });
const opacity = computed({ get: () => props.opacity, set: (v) => emits("update:opacity", v) });
</script>

<template>
  <div class="c-section">
    <div class="c-section__title">フィルター</div>
    <div class="c-section__row">
      <span class="c-section__label">コントラスト</span>
      <div class="c-section__input">
        <InputSlideAndNumber v-model="contrast" :min="-100" :max="100" />
      </div>
    </div>
    <div class="c-section__row">
      <span class="c-section__label">明度</span>
      <div class="c-section__input">
        <InputSlideAndNumber v-model="brightness" :min="-100" :max="100" />
      </div>
    </div>
    <div class="c-section__row">
      <span class="c-section__label">彩度</span>
      <div class="c-section__input">
        <InputSlideAndNumber v-model="saturation" :min="-100" :max="100" />
      </div>
    </div>
    <div class="c-section__row">
      <span class="c-section__label">色相</span>
      <div class="c-section__input">
        <InputSlideAndNumber v-model="hueRotation" :min="-100" :max="100" />
      </div>
    </div>
    <div class="c-section__row">
      <span class="c-section__label">ぼかし</span>
      <div class="c-section__input">
        <InputSlideAndNumber v-model="blur" :min="0" :max="100" />
      </div>
    </div>
    <div class="c-section__row">
      <span class="c-section__label">透明度</span>
      <div class="c-section__input">
        <InputSlideAndNumber v-model="opacity" :min="0" :max="100" />
      </div>
    </div>
    <div class="c-section__row">
      <ToolButton
        icon="/commons/icons/crop.svg"
        label="トリミング"
        @click="emits('crop-start')"
      />
    </div>
    <div class="c-section__row">
      <ToolButton
        icon="/commons/icons/eraser.svg"
        label="背景透過 (remove.bg)"
        :disabled="isProcessing"
        @click="emits('remove-background')"
      />
      <span v-if="isProcessing" class="c-section__processing">処理中…</span>
    </div>
    <div v-if="errorMessage" class="c-section__error">
      {{ errorMessage }}
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

  &__processing {
    font-size: 0.68rem;
    color: #666;
  }

  &__error {
    margin-top: 0.3rem;
    padding: 0.3rem 0.4rem;
    background: #fff0f0;
    border: 0.05rem solid #ffaaaa;
    border-radius: 0.2rem;
    font-size: 0.65rem;
    color: #c00;
    line-height: 1.4;
  }
}
</style>
