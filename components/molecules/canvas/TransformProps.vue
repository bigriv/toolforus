<script setup lang="ts">
import InputNumber from "@/components/molecules/interfaces/InputNumber.vue";
import InputSlideAndNumber from "@/components/molecules/interfaces/InputSlideAndNumber.vue";
import ToolButton from "@/components/atoms/interfaces/ToolButton.vue";

const props = defineProps<{
  x: number;
  y: number;
  width: number;
  height: number;
  angle: number;
}>();

const emits = defineEmits<{
  "update:x": [v: number];
  "update:y": [v: number];
  "update:width": [v: number];
  "update:height": [v: number];
  "update:angle": [v: number];
  "flip-horizontal": [];
  "flip-vertical": [];
}>();

const x = computed({ get: () => props.x, set: (v) => emits("update:x", v) });
const y = computed({ get: () => props.y, set: (v) => emits("update:y", v) });
const width = computed({ get: () => props.width, set: (v) => emits("update:width", v) });
const height = computed({ get: () => props.height, set: (v) => emits("update:height", v) });
const angle = computed({ get: () => props.angle, set: (v) => emits("update:angle", v) });
</script>

<template>
  <div class="c-section">
    <div class="c-section__title">変形</div>
    <div class="c-section__grid">
      <div class="c-section__grid-cell">
        <span class="c-section__label c-section__label--short">X</span>
        <div class="c-section__input">
          <InputNumber v-model="x" :min="-4000" :max="4000" mode="int" />
        </div>
      </div>
      <div class="c-section__grid-cell">
        <span class="c-section__label c-section__label--short">Y</span>
        <div class="c-section__input">
          <InputNumber v-model="y" :min="-4000" :max="4000" mode="int" />
        </div>
      </div>
    </div>
    <div class="c-section__grid">
      <div class="c-section__grid-cell">
        <span class="c-section__label c-section__label--short">W</span>
        <div class="c-section__input">
          <InputNumber v-model="width" :min="1" :max="4000" mode="uint" />
        </div>
      </div>
      <div class="c-section__grid-cell">
        <span class="c-section__label c-section__label--short">H</span>
        <div class="c-section__input">
          <InputNumber v-model="height" :min="1" :max="4000" mode="uint" />
        </div>
      </div>
    </div>
    <div class="c-section__row">
      <span class="c-section__label">角度</span>
      <div class="c-section__input">
        <InputSlideAndNumber v-model="angle" :min="-180" :max="180" />
      </div>
    </div>
    <div class="c-section__row">
      <ToolButton
        icon="/commons/icons/flip_horizontal.svg"
        label="水平反転"
        @click="emits('flip-horizontal')"
      />
      <ToolButton
        icon="/commons/icons/flip_vertical.svg"
        label="垂直反転"
        @click="emits('flip-vertical')"
      />
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

    &--short {
      width: 0.8rem;
    }
  }

  &__input {
    flex: 1;
    min-width: 0;
  }

  &__grid {
    display: flex;
    gap: 0.3rem;
    margin-bottom: 0.35rem;

    &-cell {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 0.2rem;
      min-width: 0;

      .c-section__input {
        flex: 1;
        min-width: 0;
      }
    }
  }
}
</style>
