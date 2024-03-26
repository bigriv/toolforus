<script setup lang="ts">
import BasicNote from "@/components/templates/generals/BasicNote.vue";
import FreehandNote from "@/components/templates/generals/FreehandNote.vue";
import IdeaMap from "@/components/templates/generals/IdeaMap.vue";
import Translate from "@/components/templates/generals/Translate.vue";
import StopWatch from "@/components/templates/generals/StopWatch.vue";
import { TOU_COMPONENT_TYPE } from "~/types/integrater/component";
import type { TOUIntegrater } from "~/types/integrater/integrater";

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
</script>

<template>
  <div class="c-integrater_view">
    <div
      class="c-integrater_view__main"
      :style="{
        '--row': ROW_NUM,
        '--col': COL_NUM,
      }"
    >
      <div
        v-for="content in integrater.components"
        class="c-integrater_view__main__container"
        :style="{
          '--startX': content.start.x,
          '--startY': content.start.y,
          '--endX': content.end.x,
          '--endY': content.end.y,
        }"
      >
        <div
          class="c-integrater_view__main__container__content"
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
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.c-integrater_view {
  position: relative;
  width: 100%;
  height: 100%;
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
    }
  }
}
</style>
