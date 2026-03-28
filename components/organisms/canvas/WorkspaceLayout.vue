<script setup lang="ts">
type PanelKey = "layer" | "canvas" | "properties";

interface PanelState {
  startX: number;
  endX: number;
  startY: number;
  endY: number;
}

const props = defineProps<{
  storageKey: string;
  titles?: Partial<Record<PanelKey, string>>;
}>();

const COL_NUM = 12;
const ROW_NUM = 6;
const PANELS: PanelKey[] = ["layer", "canvas", "properties"];

const DEFAULT_PANELS: Record<PanelKey, PanelState> = {
  layer: { startX: 1, endX: 3, startY: 1, endY: ROW_NUM + 1 },
  canvas: { startX: 3, endX: 10, startY: 1, endY: ROW_NUM + 1 },
  properties: { startX: 10, endX: 13, startY: 1, endY: ROW_NUM + 1 },
};

const mainRef = ref<HTMLElement>();
const panels = ref<Record<PanelKey, PanelState>>(
  JSON.parse(JSON.stringify(DEFAULT_PANELS)),
);

const grabbing = ref<PanelKey | null>(null);
const resizing = ref<{ key: PanelKey; hDir: number; vDir: number } | null>(
  null,
);
const newStart = ref<{ x: number; y: number } | null>(null);
const newEnd = ref<{ x: number; y: number } | null>(null);

const isActive = computed(
  () => grabbing.value !== null || resizing.value !== null,
);

const saveLayout = () => {
  localStorage.setItem(props.storageKey, JSON.stringify(panels.value));
};

const loadLayout = (): boolean => {
  const raw = localStorage.getItem(props.storageKey);
  if (!raw) return false;
  try {
    const data = JSON.parse(raw) as Record<PanelKey, PanelState>;
    if (PANELS.every((k) => data[k] && typeof data[k].startX === "number")) {
      panels.value = data;
      return true;
    }
  } catch {}
  return false;
};

const resetLayout = () => {
  panels.value = JSON.parse(JSON.stringify(DEFAULT_PANELS));
  saveLayout();
};

const getFloorCell = (event: MouseEvent) => {
  if (!mainRef.value) return { x: 1, y: 1 };
  const cw = mainRef.value.offsetWidth / COL_NUM;
  const ch = mainRef.value.offsetHeight / ROW_NUM;
  return {
    x: Math.floor(event.offsetX / cw) + 1,
    y: Math.floor(event.offsetY / ch) + 1,
  };
};

const getRoundCell = (event: MouseEvent) => {
  if (!mainRef.value) return { x: 1, y: 1 };
  const cw = mainRef.value.offsetWidth / COL_NUM;
  const ch = mainRef.value.offsetHeight / ROW_NUM;
  return {
    x: Math.round(event.offsetX / cw) + 1,
    y: Math.round(event.offsetY / ch) + 1,
  };
};

const onGrab = (key: PanelKey, e: MouseEvent) => {
  e.preventDefault();
  grabbing.value = key;
  resizing.value = null;
  newStart.value = { x: panels.value[key].startX, y: panels.value[key].startY };
  newEnd.value = { x: panels.value[key].endX, y: panels.value[key].endY };
};

const onResizeStart = (
  key: PanelKey,
  hDir: number,
  vDir: number,
  e: MouseEvent,
) => {
  e.preventDefault();
  e.stopPropagation();
  grabbing.value = null;
  resizing.value = { key, hDir, vDir };
  newStart.value = { x: panels.value[key].startX, y: panels.value[key].startY };
  newEnd.value = { x: panels.value[key].endX, y: panels.value[key].endY };
};

const onMove = (event: MouseEvent) => {
  if (grabbing.value) {
    const cell = getFloorCell(event);
    const p = panels.value[grabbing.value];
    const w = p.endX - p.startX;
    const h = p.endY - p.startY;
    let sx = cell.x;
    let sy = cell.y;
    if (sx < 1) sx = 1;
    if (sx + w > COL_NUM + 1) sx = COL_NUM + 1 - w;
    if (sy < 1) sy = 1;
    if (sy + h > ROW_NUM + 1) sy = ROW_NUM + 1 - h;
    newStart.value = { x: sx, y: sy };
    newEnd.value = { x: sx + w, y: sy + h };
  }

  if (resizing.value) {
    const { hDir, vDir } = resizing.value;
    const cell = getRoundCell(event);
    const cx = Math.min(COL_NUM + 1, Math.max(1, cell.x));
    const cy = Math.min(ROW_NUM + 1, Math.max(1, cell.y));
    const s = { ...newStart.value! };
    const e = { ...newEnd.value! };
    if (hDir > 0 && cx > s.x + 1) e.x = cx;
    else if (hDir < 0 && cx < e.x - 1) s.x = cx;
    if (vDir > 0 && cy > s.y + 1) e.y = cy;
    else if (vDir < 0 && cy < e.y - 1) s.y = cy;
    newStart.value = s;
    newEnd.value = e;
  }
};

const onRelease = () => {
  if (grabbing.value && newStart.value && newEnd.value) {
    panels.value[grabbing.value] = {
      startX: newStart.value.x,
      endX: newEnd.value.x,
      startY: newStart.value.y,
      endY: newEnd.value.y,
    };
    saveLayout();
  }
  if (resizing.value && newStart.value && newEnd.value) {
    panels.value[resizing.value.key] = {
      startX: newStart.value.x,
      endX: newEnd.value.x,
      startY: newStart.value.y,
      endY: newEnd.value.y,
    };
    saveLayout();
  }
  grabbing.value = null;
  resizing.value = null;
  newStart.value = null;
  newEnd.value = null;
};

const onCancel = () => {
  grabbing.value = null;
  resizing.value = null;
  newStart.value = null;
  newEnd.value = null;
};

const getDisplayState = (key: PanelKey): PanelState => {
  const isMoving = grabbing.value === key || resizing.value?.key === key;
  if (isMoving && newStart.value && newEnd.value) {
    return {
      startX: newStart.value.x,
      endX: newEnd.value.x,
      startY: newStart.value.y,
      endY: newEnd.value.y,
    };
  }
  return panels.value[key];
};

onMounted(() => {
  loadLayout();
});
</script>

<template>
  <div class="c-workspace">
    <!-- グリッド背景 -->
    <div
      class="c-workspace__grid"
      :style="{ '--col': COL_NUM, '--row': ROW_NUM }"
    >
      <template v-for="r in ROW_NUM" :key="r">
        <div v-for="c in COL_NUM" :key="c" class="c-workspace__grid__cell" />
      </template>
    </div>

    <!-- パネル -->
    <div
      ref="mainRef"
      class="c-workspace__main"
      :style="{ '--col': COL_NUM, '--row': ROW_NUM }"
    >
      <div
        v-for="key in PANELS"
        :key="key"
        class="c-workspace__panel"
        :class="{
          'c-workspace__panel--active':
            grabbing === key || resizing?.key === key,
        }"
        :style="{
          gridColumn: `${getDisplayState(key).startX} / ${getDisplayState(key).endX}`,
          gridRow: `${getDisplayState(key).startY} / ${getDisplayState(key).endY}`,
        }"
      >
        <!-- ヘッダー（ドラッグハンドル） -->
        <div
          class="c-workspace__panel__header"
          @mousedown="(e) => onGrab(key, e)"
        >
          <span class="c-workspace__panel__header__title">{{
            titles?.[key] ?? key
          }}</span>
          <button
            v-if="key === 'canvas'"
            class="c-workspace__panel__header__reset"
            title="レイアウトをリセット"
            @mousedown.stop
            @click="resetLayout"
          >
            ⌂
          </button>
        </div>

        <!-- コンテンツ -->
        <div class="c-workspace__panel__content">
          <slot :name="key" />
        </div>

        <!-- リサイズハンドル -->
        <div
          class="c-workspace__panel__resize--n"
          @mousedown.stop="(e) => onResizeStart(key, 0, -1, e)"
        />
        <div
          class="c-workspace__panel__resize--s"
          @mousedown.stop="(e) => onResizeStart(key, 0, 1, e)"
        />
        <div
          class="c-workspace__panel__resize--w"
          @mousedown.stop="(e) => onResizeStart(key, -1, 0, e)"
        />
        <div
          class="c-workspace__panel__resize--e"
          @mousedown.stop="(e) => onResizeStart(key, 1, 0, e)"
        />
        <div
          class="c-workspace__panel__resize--nw"
          @mousedown.stop="(e) => onResizeStart(key, -1, -1, e)"
        />
        <div
          class="c-workspace__panel__resize--ne"
          @mousedown.stop="(e) => onResizeStart(key, 1, -1, e)"
        />
        <div
          class="c-workspace__panel__resize--sw"
          @mousedown.stop="(e) => onResizeStart(key, -1, 1, e)"
        />
        <div
          class="c-workspace__panel__resize--se"
          @mousedown.stop="(e) => onResizeStart(key, 1, 1, e)"
        />
      </div>
    </div>

    <!-- ドラッグ・リサイズ中のオーバーレイ -->
    <div
      v-if="isActive"
      class="c-workspace__overlay"
      :class="{
        'u-mouse_icon--grabbing': grabbing !== null,
        'u-mouse_icon--resize_ew':
          resizing && resizing.hDir !== 0 && resizing.vDir === 0,
        'u-mouse_icon--resize_ns':
          resizing && resizing.hDir === 0 && resizing.vDir !== 0,
        'u-mouse_icon--resize_nwse':
          resizing && resizing.hDir * resizing.vDir > 0,
        'u-mouse_icon--resize_nesw':
          resizing && resizing.hDir * resizing.vDir < 0,
      }"
      @mousemove="onMove"
      @mouseup="onRelease"
      @mouseleave="onCancel"
    />
  </div>
</template>

<style scoped lang="scss">
$r: 5px;
$header-h: 24px;

.c-workspace {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #ccc;

  &__grid {
    position: absolute;
    inset: 0;
    display: grid;
    grid-template-columns: repeat(var(--col), 1fr);
    grid-template-rows: repeat(var(--row), 1fr);
    pointer-events: none;

    &__cell {
      border: 0.05rem dashed #bbb;
    }
  }

  &__main {
    position: absolute;
    inset: 0;
    display: grid;
    grid-template-columns: repeat(var(--col), 1fr);
    grid-template-rows: repeat(var(--row), 1fr);
  }

  &__panel {
    position: relative;
    border: 0.1rem solid #999;
    background: white;
    display: flex;
    flex-direction: column;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    overflow: hidden;
    opacity: 0.9;

    &--active {
      opacity: 1;
      z-index: 2;
    }

    &__header {
      height: $header-h;
      background: #efefef;
      border-bottom: 0.1rem solid #ddd;
      display: flex;
      align-items: center;
      padding: 0 0.4rem;
      cursor: grab;
      user-select: none;
      flex-shrink: 0;
      gap: 0.3rem;

      &:active {
        cursor: grabbing;
      }

      &__title {
        font-size: 0.7rem;
        font-weight: bold;
        color: #555;
        flex: 1;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      &__reset {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 0.9rem;
        color: #888;
        padding: 0 0.2rem;
        line-height: 1;
        &:hover {
          color: #333;
        }
      }
    }

    &__content {
      flex: 1;
      overflow: hidden;
      position: relative;
    }

    // リサイズハンドル
    &__resize {
      &--n {
        position: absolute;
        top: 0;
        left: $r;
        right: $r;
        height: $r;
        cursor: ns-resize;
        z-index: 1;
      }
      &--s {
        position: absolute;
        bottom: 0;
        left: $r;
        right: $r;
        height: $r;
        cursor: ns-resize;
        z-index: 1;
      }
      &--w {
        position: absolute;
        left: 0;
        top: $r;
        bottom: $r;
        width: $r;
        cursor: ew-resize;
        z-index: 1;
      }
      &--e {
        position: absolute;
        right: 0;
        top: $r;
        bottom: $r;
        width: $r;
        cursor: ew-resize;
        z-index: 1;
      }
      &--nw {
        position: absolute;
        top: 0;
        left: 0;
        width: $r;
        height: $r;
        cursor: nwse-resize;
        z-index: 1;
      }
      &--ne {
        position: absolute;
        top: 0;
        right: 0;
        width: $r;
        height: $r;
        cursor: nesw-resize;
        z-index: 1;
      }
      &--sw {
        position: absolute;
        bottom: 0;
        left: 0;
        width: $r;
        height: $r;
        cursor: nesw-resize;
        z-index: 1;
      }
      &--se {
        position: absolute;
        bottom: 0;
        right: 0;
        width: $r;
        height: $r;
        cursor: nwse-resize;
        z-index: 1;
      }
    }
  }

  &__overlay {
    position: absolute;
    inset: 0;
    z-index: 10000;
  }
}
</style>
