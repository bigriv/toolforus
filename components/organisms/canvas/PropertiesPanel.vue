<script setup lang="ts">
import ToolButton from "@/components/atoms/interfaces/ToolButton.vue";
import PenProps from "@/components/molecules/canvas/PenProps.vue";
import TransformProps from "@/components/molecules/canvas/TransformProps.vue";
import ImageFilterProps from "@/components/molecules/canvas/ImageFilterProps.vue";
import ShapeProps from "@/components/molecules/canvas/ShapeProps.vue";
import TextProps from "@/components/molecules/canvas/TextProps.vue";
import { TOUColor } from "@/types/common/color/color";

// --- 表示フラグ ---
const props = defineProps<{
  showPen?: boolean;
  showTransform?: boolean;
  showImageFilter?: boolean;
  showShape?: boolean;
  showText?: boolean;
  showActions?: boolean;

  // ペン設定
  penColor?: TOUColor;
  penSize?: number;

  // 変形
  transformX?: number;
  transformY?: number;
  transformWidth?: number;
  transformHeight?: number;
  transformAngle?: number;

  // フィルター
  filterContrast?: number;
  filterBrightness?: number;
  filterSaturation?: number;
  filterHueRotation?: number;
  filterBlur?: number;
  filterOpacity?: number;
  isProcessing?: boolean;
  errorMessage?: string;

  // 図形
  shapeFill?: TOUColor;
  shapeBorder?: TOUColor;
  shapeBorderWidth?: number;

  // テキスト
  textContent?: string;
  textSize?: number;
  textColor?: TOUColor;
  textStroke?: TOUColor;
  textStrokeWidth?: number;
}>();

const emits = defineEmits<{
  // ペン
  "update:penColor": [v: TOUColor];
  "update:penSize": [v: number];

  // 変形
  "update:transformX": [v: number];
  "update:transformY": [v: number];
  "update:transformWidth": [v: number];
  "update:transformHeight": [v: number];
  "update:transformAngle": [v: number];
  "flip-horizontal": [];
  "flip-vertical": [];

  // フィルター
  "update:filterContrast": [v: number];
  "update:filterBrightness": [v: number];
  "update:filterSaturation": [v: number];
  "update:filterHueRotation": [v: number];
  "update:filterBlur": [v: number];
  "update:filterOpacity": [v: number];
  "crop-start": [];
  "remove-background": [];

  // 図形
  "update:shapeFill": [v: TOUColor];
  "update:shapeBorder": [v: TOUColor];
  "update:shapeBorderWidth": [v: number];
  "shape-color-open": [];
  "shape-color-cancel": [];

  // テキスト
  "update:textContent": [v: string];
  "update:textSize": [v: number];
  "update:textColor": [v: TOUColor];
  "update:textStroke": [v: TOUColor];
  "update:textStrokeWidth": [v: number];
  "change-text": [v: string];
  "text-color-open": [];
  "text-color-cancel": [];

  // アクション
  delete: [];
}>();
</script>

<template>
  <div class="c-props-panel">
    <!-- ペン設定 -->
    <PenProps
      v-if="showPen && penColor !== undefined && penSize !== undefined"
      :color="penColor"
      :size="penSize"
      @update:color="emits('update:penColor', $event)"
      @update:size="emits('update:penSize', $event)"
    />

    <!-- 変形 -->
    <TransformProps
      v-if="
        showTransform &&
        transformX !== undefined &&
        transformY !== undefined &&
        transformWidth !== undefined &&
        transformHeight !== undefined &&
        transformAngle !== undefined
      "
      :x="transformX"
      :y="transformY"
      :width="transformWidth"
      :height="transformHeight"
      :angle="transformAngle"
      @update:x="emits('update:transformX', $event)"
      @update:y="emits('update:transformY', $event)"
      @update:width="emits('update:transformWidth', $event)"
      @update:height="emits('update:transformHeight', $event)"
      @update:angle="emits('update:transformAngle', $event)"
      @flip-horizontal="emits('flip-horizontal')"
      @flip-vertical="emits('flip-vertical')"
    />

    <!-- 画像フィルター -->
    <ImageFilterProps
      v-if="
        showImageFilter &&
        filterContrast !== undefined &&
        filterBrightness !== undefined &&
        filterSaturation !== undefined &&
        filterHueRotation !== undefined &&
        filterBlur !== undefined &&
        filterOpacity !== undefined
      "
      :contrast="filterContrast"
      :brightness="filterBrightness"
      :saturation="filterSaturation"
      :hue-rotation="filterHueRotation"
      :blur="filterBlur"
      :opacity="filterOpacity"
      :is-processing="isProcessing"
      :error-message="errorMessage"
      @update:contrast="emits('update:filterContrast', $event)"
      @update:brightness="emits('update:filterBrightness', $event)"
      @update:saturation="emits('update:filterSaturation', $event)"
      @update:hue-rotation="emits('update:filterHueRotation', $event)"
      @update:blur="emits('update:filterBlur', $event)"
      @update:opacity="emits('update:filterOpacity', $event)"
      @crop-start="emits('crop-start')"
      @remove-background="emits('remove-background')"
    />

    <!-- 図形設定 -->
    <ShapeProps
      v-if="
        showShape &&
        shapeFill !== undefined &&
        shapeBorder !== undefined &&
        shapeBorderWidth !== undefined
      "
      :fill="shapeFill"
      :border="shapeBorder"
      :border-width="shapeBorderWidth"
      @update:fill="emits('update:shapeFill', $event)"
      @update:border="emits('update:shapeBorder', $event)"
      @update:border-width="emits('update:shapeBorderWidth', $event)"
      @color-open="emits('shape-color-open')"
      @color-cancel="emits('shape-color-cancel')"
    />

    <!-- テキスト設定 -->
    <TextProps
      v-if="
        showText &&
        textContent !== undefined &&
        textSize !== undefined &&
        textColor !== undefined &&
        textStroke !== undefined &&
        textStrokeWidth !== undefined
      "
      :text="textContent"
      :size="textSize"
      :color="textColor"
      :stroke="textStroke"
      :stroke-width="textStrokeWidth"
      @update:text="emits('update:textContent', $event)"
      @update:size="emits('update:textSize', $event)"
      @update:color="emits('update:textColor', $event)"
      @update:stroke="emits('update:textStroke', $event)"
      @update:stroke-width="emits('update:textStrokeWidth', $event)"
      @change-text="emits('change-text', $event)"
      @color-open="emits('text-color-open')"
      @color-cancel="emits('text-color-cancel')"
    />

    <!-- 削除ボタン -->
    <div v-if="showActions" class="c-props-panel__actions">
      <ToolButton
        icon="/commons/icons/delete.svg"
        label="削除"
        color="red"
        @click="emits('delete')"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.c-props-panel {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  background: white;

  // ToolInputText のラベルを左側に開く
  :deep(.c-tool_input_text__label) {
    left: auto;
    right: calc(100% + 0.5rem);
  }

  &__actions {
    display: flex;
    gap: 0.3rem;
    flex-wrap: wrap;
    padding: 0.5rem;
    border-bottom: 0.1rem solid #eee;
  }
}
</style>
