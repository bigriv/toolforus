<script setup lang="ts">
import { TOUPosition } from "@/types/common/position";
import BasicNote from "./BasicNote.vue";
import FreehandNote from "./FreehandNote.vue";
import IdeaMap from "./IdeaMap.vue";
import Translate from "./Translate.vue";
import StopWatch from "./StopWatch.vue";

const COL_NUM = 16;
const ROW_NUM = 9;

enum TOU_COMPONENT_TYPE {
  BASIC_NOTE,
  FREEHAND_NOTE,
  IDEA_MAP,
  STOP_WATCH,
  TRANSLATE,
}
class TOUComopnent {
  type: TOU_COMPONENT_TYPE;
  start: TOUPosition;
  end: TOUPosition;
  constructor(type: TOU_COMPONENT_TYPE, start: TOUPosition, end: TOUPosition) {
    this.type = type;
    this.start = start;
    this.end = end;
  }
}
const custom_main: Ref<HTMLElement | null> = ref(null);
const contents: Ref<Array<TOUComopnent>> = ref([
  new TOUComopnent(
    TOU_COMPONENT_TYPE.BASIC_NOTE,
    new TOUPosition(1, 4),
    new TOUPosition(9, ROW_NUM + 1)
  ),
  new TOUComopnent(
    TOU_COMPONENT_TYPE.FREEHAND_NOTE,
    new TOUPosition(9, 4),
    new TOUPosition(COL_NUM + 1, ROW_NUM + 1)
  ),
  new TOUComopnent(
    TOU_COMPONENT_TYPE.TRANSLATE,
    new TOUPosition(1, 1),
    new TOUPosition(COL_NUM + 1, 4)
  ),
]);
const grabbing: Ref<TOUComopnent | undefined> = ref();
const resizing: Ref<TOUComopnent | undefined> = ref();
const resizeDirection: Ref<{
  horizontal: number;
  vertaical: number;
}> = ref({
  horizontal: 0,
  vertaical: 0,
});
const newStart: Ref<TOUPosition | undefined> = ref();
const newEnd: Ref<TOUPosition | undefined> = ref();

const moveComponent = (event: MouseEvent) => {
  if (!custom_main.value) {
    return;
  }
  if (!grabbing.value) {
    return;
  }
  const cellWidth = custom_main.value.offsetWidth / COL_NUM;
  const cellHeight = custom_main.value.offsetHeight / ROW_NUM;
  const width = grabbing.value.end.x - grabbing.value.start.x;
  const height = grabbing.value.end.y - grabbing.value.start.y;
  newStart.value = new TOUPosition(
    Math.floor(event.offsetX / cellWidth) + 1,
    Math.floor(event.offsetY / cellHeight) + 1
  );
  newEnd.value = new TOUPosition(
    newStart.value.x + width,
    newStart.value.y + height
  );

  // 最小値、最大値チェック
  if (newStart.value.x < 1) {
    newStart.value.x = 1;
    newEnd.value.x = width + 1;
  }
  if (newEnd.value.x > COL_NUM + 1) {
    newStart.value.x = COL_NUM + 1 - width;
    newEnd.value.x = COL_NUM + 1;
  }
  if (newStart.value.y < 1) {
    newStart.value.y = 1;
    newEnd.value.y = height + 1;
  }
  if (newEnd.value.y > ROW_NUM + 1) {
    newStart.value.y = ROW_NUM + 1 - height;
    newEnd.value.y = ROW_NUM + 1;
  }
};
const resizeComponent = (event: MouseEvent) => {
  if (!custom_main.value) {
    return;
  }
  if (!resizing.value) {
    return;
  }
  const cellWidth = custom_main.value.offsetWidth / COL_NUM;
  const cellHeight = custom_main.value.offsetHeight / ROW_NUM;
  let newX = Math.round(event.offsetX / cellWidth) + 1;
  let newY = Math.round(event.offsetY / cellHeight) + 1;

  // 最小値、最大値チェック
  if (newX < 1) {
    newX = 1;
  } else if (newX > COL_NUM + 1) {
    newX = COL_NUM + 1;
  }
  if (newY < 1) {
    newY = 1;
  } else if (newY > ROW_NUM + 1) {
    newY = ROW_NUM + 1;
  }

  // リサイズ処理
  newStart.value = new TOUPosition(
    newStart.value?.x ?? resizing.value.start.x,
    newStart.value?.y ?? resizing.value.start.y
  );
  newEnd.value = new TOUPosition(
    newEnd.value?.x ?? resizing.value.end.x,
    newEnd.value?.y ?? resizing.value.end.y
  );
  if (resizeDirection.value.horizontal > 0) {
    if (event.movementX < 0) {
      if (newX - resizing.value.start.x >= 1) {
        newEnd.value.x = newX;
      }
    } else if (event.movementX > 0) {
      if (newX <= COL_NUM + 1) {
        newEnd.value.x = newX;
      }
    }
  } else if (resizeDirection.value.horizontal < 0) {
    if (event.movementX < 0) {
      if (newX >= 1) {
        newStart.value.x = newX;
      }
    } else if (event.movementX > 0) {
      if (resizing.value.end.x - newX >= 1) {
        newStart.value.x = newX;
      }
    }
  }
  if (resizeDirection.value.vertaical > 0) {
    if (event.movementY < 0) {
      if (newY >= 1) {
        newStart.value.y = newY;
      }
    } else if (event.movementY > 0) {
      if (resizing.value.end.y - newY > 1) {
        newStart.value.y = newY;
      }
    }
  } else if (resizeDirection.value.vertaical < 0) {
    if (event.movementY < 0) {
      if (newY - resizing.value.start.y >= 1) {
        newEnd.value.y = newY;
      }
    } else if (event.movementY > 0) {
      if (newY <= ROW_NUM + 1) {
        newEnd.value.y = newY;
      }
    }
  }
};
const onMove = (event: MouseEvent) => {
  moveComponent(event);
  resizeComponent(event);
};
const onGrab = (content: TOUComopnent) => {
  grabbing.value = content;
  resizing.value = undefined;
  newStart.value = content.start;
  newEnd.value = content.end;
};
const onResize = (
  content: TOUComopnent,
  horizontal: number,
  vertical: number
) => {
  grabbing.value = undefined;
  resizing.value = content;
  newStart.value = content.start;
  newEnd.value = content.end;
  resizeDirection.value = {
    horizontal: horizontal,
    vertaical: vertical,
  };
};
const onMoveCancel = () => {
  grabbing.value = undefined;
  resizing.value = undefined;
  resizeDirection.value.horizontal = 0;
  resizeDirection.value.vertaical = 0;
  newStart.value = undefined;
  newEnd.value = undefined;
};
const onRelease = () => {
  if (!newStart.value) {
    return;
  }
  if (!newEnd.value) {
    return;
  }
  if (grabbing.value) {
    // 位置を更新
    grabbing.value.start = newStart.value;
    grabbing.value.end = newEnd.value;
    grabbing.value = undefined;
  }
  if (resizing.value) {
    // 位置を更新
    resizing.value.start = newStart.value;
    resizing.value.end = newEnd.value;
    resizing.value = undefined;
    resizeDirection.value.horizontal = 0;
    resizeDirection.value.vertaical = 0;
  }

  newStart.value = undefined;
  newEnd.value = undefined;
};
</script>

<template>
  <div class="c-custom" @mouseleave="onMoveCancel" @mouseup="onRelease">
    <div
      class="c-custom__moving_panel"
      :style="{
        'z-index': grabbing || resizing ? 1 : 0,
      }"
      :class="{
        'u-mouse_icon--grabbing': grabbing,

        'u-mouse_icon--resize_ew':
          resizing &&
          resizeDirection.horizontal !== 0 &&
          resizeDirection.vertaical === 0,
        'u-mouse_icon--resize_ns':
          resizing &&
          resizeDirection.horizontal === 0 &&
          resizeDirection.vertaical !== 0,
        'u-mouse_icon--resize_nesw':
          resizing &&
          resizeDirection.horizontal * resizeDirection.vertaical > 0,
        'u-mouse_icon--resize_nwse':
          resizing &&
          resizeDirection.horizontal * resizeDirection.vertaical < 0,
      }"
      @mousemove="onMove"
    ></div>
    <div
      class="c-custom__layout"
      :style="{
        '--row': ROW_NUM,
        '--col': COL_NUM,
      }"
    >
      <template v-for="row in ROW_NUM">
        <template v-for="col in COL_NUM">
          <div
            class="c-custom__layout__content"
            :style="{
              '--startX': col,
              '--startY': row,
              '--endX': col + 1,
              '--endY': row + 1,
            }"
            @mousemove.prevent.stop
          ></div>
        </template>
      </template>
    </div>
    <div
      ref="custom_main"
      class="c-custom__main"
      :style="{
        '--row': ROW_NUM,
        '--col': COL_NUM,
      }"
    >
      <div
        v-for="content in contents"
        class="c-custom__main__container"
        :style="{
          '--startX':
            content === grabbing || content === resizing
              ? newStart?.x
              : content.start.x,
          '--startY':
            content === grabbing || content === resizing
              ? newStart?.y
              : content.start.y,
          '--endX':
            content === grabbing || content === resizing
              ? newEnd?.x
              : content.end.x,
          '--endY':
            content === grabbing || content === resizing
              ? newEnd?.y
              : content.end.y,
        }"
        :class="{
          'c-custom__main__container--slecting':
            content === grabbing || content === resizing,
        }"
      >
        <div
          class="c-custom__main__container__content"
          @mousemove.prevent.stop
          @mouseleave.prevent.stop
        >
          <BasicNote v-if="content.type === TOU_COMPONENT_TYPE.BASIC_NOTE" />
          <FreehandNote
            v-else-if="content.type === TOU_COMPONENT_TYPE.FREEHAND_NOTE"
          />
          <IdeaMap v-else-if="content.type === TOU_COMPONENT_TYPE.IDEA_MAP" />
          <StopWatch
            v-else-if="content.type === TOU_COMPONENT_TYPE.STOP_WATCH"
          />
          <Translate
            v-else-if="content.type === TOU_COMPONENT_TYPE.TRANSLATE"
          />
        </div>
        <div
          class="c-custom__main__container__layer--resize_up"
          @mousedown="() => onResize(content, 0, 1)"
        ></div>
        <div
          class="c-custom__main__container__layer--resize_down"
          @mousedown="() => onResize(content, 0, -1)"
        ></div>
        <div
          class="c-custom__main__container__layer--resize_left"
          @mousedown="() => onResize(content, -1, 0)"
        ></div>
        <div
          class="c-custom__main__container__layer--resize_right"
          @mousedown="() => onResize(content, 1, 0)"
        ></div>
        <div
          class="c-custom__main__container__layer--resize_left_up"
          @mousedown="() => onResize(content, -1, 1)"
        ></div>
        <div
          class="c-custom__main__container__layer--resize_right_up"
          @mousedown="() => onResize(content, 1, 1)"
        ></div>
        <div
          class="c-custom__main__container__layer--resize_left_down"
          @mousedown="() => onResize(content, -1, -1)"
        ></div>
        <div
          class="c-custom__main__container__layer--resize_right_down"
          @mousedown="() => onResize(content, 1, -1)"
        ></div>
        <div
          class="c-custom__main__container__layer--grab"
          @mousedown="() => onGrab(content)"
        ></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.c-custom {
  position: relative;
  width: 90%;
  height: 90%;
  display: flex;
  justify-content: center;
  margin: 0 auto;
  &__moving_panel {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }
  &__layout {
    position: absolute;
    display: grid;
    width: 100%;
    height: 100%;
    border: 0.1rem #aaa solid;
    grid-template-columns: repeat(var(--col), calc(100% / var(--col)));
    grid-template-rows: repeat(var(--row), calc(100% / var(--row)));
    &__content {
      width: 100%;
      height: 100%;
      border: 0.1rem dashed #aaa;
      grid-column: var(--startX) / var(--endX);
      grid-row: var(--startY) / var(--endY);
    }
  }
  &__main {
    position: absolute;
    display: grid;
    width: 100%;
    height: 100%;
    grid-template-columns: repeat(var(--col), calc(100% / var(--col)));
    grid-template-rows: repeat(var(--row), calc(100% / var(--row)));
    &__container {
      position: relative;
      width: 100%;
      height: 100%;
      border: 0.1rem solid black;
      grid-column: var(--startX) / var(--endX);
      grid-row: var(--startY) / var(--endY);
      background: white;
      user-select: none;
      &__content {
        position: relative;
        width: 100%;
        height: 100%;
        user-select: none;
        overflow: auto;
      }
      &--selecting {
        opacity: 0.8;
      }
      &__layer {
        &--resize_up {
          position: absolute;
          top: 0;
          left: 5%;
          width: 90%;
          height: 5%;
          cursor: ns-resize;
        }
        &--resize_down {
          position: absolute;
          bottom: 0;
          left: 5%;
          width: 90%;
          height: 5%;
          cursor: ns-resize;
        }
        &--resize_left {
          position: absolute;
          top: 5%;
          left: 0;
          width: 5%;
          height: 90%;
          cursor: ew-resize;
        }
        &--resize_right {
          position: absolute;
          top: 5%;
          right: 0;
          width: 5%;
          height: 90%;
          cursor: ew-resize;
        }
        &--resize_left_up {
          position: absolute;
          top: 0;
          left: 0;
          width: 5%;
          height: 5%;
          cursor: nwse-resize;
        }
        &--resize_right_up {
          position: absolute;
          top: 0;
          right: 0;
          width: 5%;
          height: 5%;
          cursor: nesw-resize;
        }
        &--resize_left_down {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 5%;
          height: 5%;
          cursor: nesw-resize;
        }
        &--resize_right_down {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 5%;
          height: 5%;
          cursor: nwse-resize;
        }
        &--grab {
          position: absolute;
          top: 5%;
          left: 5%;
          width: 90%;
          height: 90%;
          cursor: grab;
        }
      }
    }
  }
}
.u-mouse_icon--grabbing {
  cursor: grabbing;
}
.u-mouse_icon--resize_ew {
  cursor: ew-resize;
}
.u-mouse_icon--resize_ns {
  cursor: ns-resize;
}
.u-mouse_icon--resize_nesw {
  cursor: nesw-resize;
}
.u-mouse_icon--resize_nwse {
  cursor: nwse-resize;
}
</style>
