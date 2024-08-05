<script setup lang="ts">
import BasicNote from "@/components/templates/tools/generals/BasicNote.vue";
import FreehandNote from "@/components/templates/tools/generals/FreehandNote.vue";
import IdeaMap from "@/components/templates/tools/generals/IdeaMap.vue";
import Translate from "@/components/templates/tools/generals/Translate.vue";
import Thesaurus from "@/components/templates/tools/generals/Thesaurus.vue";
import StopWatch from "@/components/templates/tools/generals/StopWatch.vue";
import ColorCompanion from "@/components/templates/tools/designs/ColorCompanion.vue";
import InstantImageEditer from "@/components/templates/tools/designs/InstantImageEditer.vue";
import { TOUPosition } from "@/types/common/position";
import {
  TOU_COMPONENT_TYPE,
  TOUComponent,
} from "@/types/tools/generals/integrater/component";
import type { TOUIntegrater } from "@/types/tools/generals/integrater/integrater";

const props = defineProps({
  integrater: {
    type: Object as PropType<TOUIntegrater>,
    required: true,
  },
  col: {
    type: Number,
    required: true,
  },
  row: {
    type: Number,
    required: true,
  },
});
const emits = defineEmits(["update:integrater"]);

const integrater = computed({
  get: () => props.integrater,
  set: (newValue) => emits("update:integrater", newValue),
});
const COL_NUM = computed(() => props.col);
const ROW_NUM = computed(() => props.row);

const custom_main = ref<HTMLCanvasElement>();
const grabbing: Ref<TOUComponent | undefined> = ref();
const resizing: Ref<TOUComponent | undefined> = ref();
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
  const cellWidth = custom_main.value.offsetWidth / COL_NUM.value;
  const cellHeight = custom_main.value.offsetHeight / ROW_NUM.value;
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
  if (newEnd.value.x > COL_NUM.value + 1) {
    newStart.value.x = COL_NUM.value + 1 - width;
    newEnd.value.x = COL_NUM.value + 1;
  }
  if (newStart.value.y < 1) {
    newStart.value.y = 1;
    newEnd.value.y = height + 1;
  }
  if (newEnd.value.y > ROW_NUM.value + 1) {
    newStart.value.y = ROW_NUM.value + 1 - height;
    newEnd.value.y = ROW_NUM.value + 1;
  }
};
const resizeComponent = (event: MouseEvent) => {
  if (!custom_main.value) {
    return;
  }
  if (!resizing.value) {
    return;
  }
  const cellWidth = custom_main.value.offsetWidth / COL_NUM.value;
  const cellHeight = custom_main.value.offsetHeight / ROW_NUM.value;
  let newX = Math.round(event.offsetX / cellWidth) + 1;
  let newY = Math.round(event.offsetY / cellHeight) + 1;

  // 最小値、最大値チェック
  if (newX < 1) {
    newX = 1;
  } else if (newX > COL_NUM.value + 1) {
    newX = COL_NUM.value + 1;
  }
  if (newY < 1) {
    newY = 1;
  } else if (newY > ROW_NUM.value + 1) {
    newY = ROW_NUM.value + 1;
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
      if (newX <= COL_NUM.value + 1) {
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
      if (newY <= ROW_NUM.value + 1) {
        newEnd.value.y = newY;
      }
    }
  }
};
const onMove = (event: MouseEvent) => {
  moveComponent(event);
  resizeComponent(event);
};
const onGrab = (content: TOUComponent) => {
  grabbing.value = content;
  resizing.value = undefined;
  newStart.value = content.start;
  newEnd.value = content.end;
};
const onDelete = (content: TOUComponent) => {
  integrater.value.remove(content);
};
const onResize = (
  content: TOUComponent,
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
  <div
    class="c-integrater_custom"
    @mouseleave="onMoveCancel"
    @mouseup="onRelease"
  >
    <div
      class="c-integrater_custom__moving_panel"
      :style="{
        'z-index': grabbing || resizing ? 10 : 0,
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
      class="c-integrater_custom__layout"
      :style="{
        '--row': ROW_NUM,
        '--col': COL_NUM,
      }"
    >
      <template v-for="row in ROW_NUM">
        <template v-for="col in COL_NUM">
          <div
            class="c-integrater_custom__layout__content"
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
      class="c-integrater_custom__main"
      :style="{
        '--row': ROW_NUM,
        '--col': COL_NUM,
      }"
    >
      <div
        v-for="content in integrater.components"
        class="c-integrater_custom__main__container"
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
          'c-integrater_custom__main__container--selecting':
            content === resizing || content === grabbing,
        }"
      >
        <div
          class="c-integrater_custom__main__container__content"
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
          <Thesaurus
            v-else-if="content.type === TOU_COMPONENT_TYPE.THESAURUS"
          />
          <ColorCompanion
            v-else-if="content.type === TOU_COMPONENT_TYPE.COLOR_COMPANION"
          />
          <InstantImageEditer
            v-else-if="content.type === TOU_COMPONENT_TYPE.INSTANT_IMAGE_EDITER"
          />
        </div>
        <div
          class="c-integrater_custom__main__container__layer--resize_up"
          @mousedown="() => onResize(content, 0, 1)"
        ></div>
        <div
          class="c-integrater_custom__main__container__layer--resize_down"
          @mousedown="() => onResize(content, 0, -1)"
        ></div>
        <div
          class="c-integrater_custom__main__container__layer--resize_left"
          @mousedown="() => onResize(content, -1, 0)"
        ></div>
        <div
          class="c-integrater_custom__main__container__layer--resize_right"
          @mousedown="() => onResize(content, 1, 0)"
        ></div>
        <div
          class="c-integrater_custom__main__container__layer--resize_left_up"
          @mousedown="() => onResize(content, -1, 1)"
        ></div>
        <div
          class="c-integrater_custom__main__container__layer--resize_right_up"
          @mousedown="() => onResize(content, 1, 1)"
        ></div>
        <div
          class="c-integrater_custom__main__container__layer--resize_left_down"
          @mousedown="() => onResize(content, -1, -1)"
        ></div>
        <div
          class="c-integrater_custom__main__container__layer--resize_right_down"
          @mousedown="() => onResize(content, 1, -1)"
        ></div>
        <div
          class="c-integrater_custom__main__container__layer--grab"
          @mousedown="() => onGrab(content)"
        ></div>
        <div
          class="c-integrater_custom__main__container__layer--delete"
          @mousedown="() => onDelete(content)"
        >
          <img src="/commons/icons/delete.svg" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.c-integrater_custom {
  position: relative;
  width: 100%;
  height: 100%;
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
      opacity: 0.8;
      &__content {
        position: relative;
        width: 100%;
        height: 100%;
        user-select: none;
        overflow: auto;
      }
      &--selecting {
        opacity: 1;
      }
      &__layer {
        &--resize_up {
          position: absolute;
          top: 0;
          left: 5%;
          width: 90%;
          height: 5%;
          z-index: 1;
          cursor: ns-resize;
        }
        &--resize_down {
          position: absolute;
          bottom: 0;
          left: 5%;
          width: 90%;
          height: 5%;
          z-index: 1;
          cursor: ns-resize;
        }
        &--resize_left {
          position: absolute;
          top: 5%;
          left: 0;
          width: 5%;
          height: 90%;
          z-index: 1;
          cursor: ew-resize;
        }
        &--resize_right {
          position: absolute;
          top: 5%;
          right: 0;
          width: 5%;
          height: 90%;
          z-index: 1;
          cursor: ew-resize;
        }
        &--resize_left_up {
          position: absolute;
          top: 0;
          left: 0;
          width: 5%;
          height: 5%;
          z-index: 1;
          cursor: nwse-resize;
        }
        &--resize_right_up {
          position: absolute;
          top: 0;
          right: 0;
          width: 5%;
          height: 5%;
          z-index: 1;
          cursor: nesw-resize;
        }
        &--resize_left_down {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 5%;
          height: 5%;
          z-index: 1;
          cursor: nesw-resize;
        }
        &--resize_right_down {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 5%;
          height: 5%;
          z-index: 1;
          cursor: nwse-resize;
        }
        &--grab {
          position: absolute;
          top: 5%;
          left: 5%;
          width: 90%;
          height: 90%;
          z-index: 1;
          cursor: grab;
        }
        &--delete {
          position: absolute;
          top: 5%;
          right: 5%;
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.8);
          box-shadow: 0 0 0.1rem black;
          z-index: 1;
          cursor: pointer;
          &:hover {
            background: rgba(221, 221, 221, 1);
          }
          img {
            width: 80%;
            height: 80%;
            text-align: center;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
        }
      }
    }
  }
}
</style>
