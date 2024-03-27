<script setup lang="ts">
import ToolDataList from "@/components/molecules/interfaces/ToolDataList.vue";
import ToolButton from "@/components/atoms/interfaces/ToolButton.vue";
import ToggleButton from "@/components/atoms/interfaces/ToggleButton.vue";
import IntegraterCustom from "@/components/templates/tools/generals/integrater/IntegraterCustom.vue";
import IntegraterView from "@/components/templates/tools/generals/integrater/IntegraterView.vue";
import { TOUPosition } from "@/types/common/position";
import {
  TOU_COMPONENT_TYPE,
  TOUComponent,
} from "@/types/tools/generals/integrater/component";
import { TOUIntegrater } from "@/types/tools/generals/integrater/integrater";

const DEFAULT_INTEGRATER_NAME = "Untitled_1";
const COL_NUM = 16;
const ROW_NUM = 9;
const COMPONENT_DEFINES = [
  {
    type: TOU_COMPONENT_TYPE.BASIC_NOTE,
    label: "メモ帳",
  },
  {
    type: TOU_COMPONENT_TYPE.FREEHAND_NOTE,
    label: "手書きメモ",
  },
  {
    type: TOU_COMPONENT_TYPE.IDEA_MAP,
    label: "連想図",
  },
  {
    type: TOU_COMPONENT_TYPE.STOP_WATCH,
    label: "ストップウォッチ",
  },
  {
    type: TOU_COMPONENT_TYPE.TRANSLATE,
    label: "翻訳機",
  },
];

const integraterList: Ref<{ [key: string]: TOUIntegrater }> = ref({});
const integrater: Ref<TOUIntegrater> = ref(new TOUIntegrater());
const integraterName: Ref<string> = ref(DEFAULT_INTEGRATER_NAME);
const selectingComponent = ref(COMPONENT_DEFINES[0].type);
const customising = ref(true);

const save = () => {
  integraterList.value[integraterName.value] = integrater.value;
  localStorage.setItem("tou.integrater", JSON.stringify(integraterList.value));
};
const onAddIntegrater = (integraterName: string) => {
  integrater.value = new TOUIntegrater();
  integraterList.value[integraterName] = integrater.value;
};
const onEditIntegrater = (integraterName: string) => {
  integrater.value = integraterList.value[integraterName];
  save();
};
const onChangeIntegrater = (integraterName: string) => {
  integrater.value = integraterList.value[integraterName];
};
const onDeleteIntegrater = (integraterName: string) => {
  integrater.value = integraterList.value[integraterName];
  save();
};
const onAddComponent = () => {
  integrater.value.components.push(
    new TOUComponent(
      selectingComponent.value,
      new TOUPosition(1, 1),
      new TOUPosition(4, 4)
    )
  );
};

onMounted(() => {
  const object = JSON.parse(
    JSON.parse(JSON.stringify(localStorage.getItem("tou.integrater")))
  );
  if (!object || Object.keys(object).length <= 0) {
    integraterList.value[integraterName.value] = integrater.value;
    return;
  }
  for (const key of Object.keys(object)) {
    integraterList.value[key] = TOUIntegrater.build(object[key].components);
  }
  integraterName.value = Object.keys(integraterList.value)[0];
  integrater.value = integraterList.value[integraterName.value];
  window.addEventListener("beforeunload", save);
});
onBeforeUnmount(() => {
  window.removeEventListener("beforeunload", save);
  save();
});
</script>

<template>
  <div class="c-integrater">
    <div class="c-integrater__toolbar">
      <div class="c-integrater__toolbar__menu">
        <ToolDataList
          v-model:list="integraterList"
          v-model:selected="integraterName"
          :data="integrater"
          @add="onAddIntegrater"
          @edit="onEditIntegrater"
          @change="onChangeIntegrater"
          @delete="onDeleteIntegrater"
        />
      </div>
      <div>
        <ToggleButton v-model="customising" label="カスタマイズ" />
      </div>
    </div>
    <div v-if="customising" class="c-integrater__toolbar">
      <div class="c-integrater__toolbar__menu">
        <div class="c-integrater__toolbar__select_components">
          <select v-model="selectingComponent">
            <option
              v-for="component in COMPONENT_DEFINES"
              :value="component.type"
              :key="component.type"
            >
              {{ component.label }}
            </option>
          </select>
        </div>
        <div>
          <ToolButton @click="onAddComponent">
            <img
              src="/commons/icons/add.svg"
              alt="追加"
              class="u-absolute--center"
            />
          </ToolButton>
        </div>
      </div>
    </div>
    <div class="c-integrater__canvas">
      <IntegraterCustom
        v-if="customising"
        v-model:integrater="integrater"
        :col="COL_NUM"
        :row="ROW_NUM"
      />
      <IntegraterView
        v-else
        v-model:integrater="integrater"
        :col="COL_NUM"
        :row="ROW_NUM"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.c-integrater {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: auto;
  &__toolbar {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    width: 100%;
    background-color: white;
    &__menu {
      display: flex;
      height: 2rem;
      &__button {
        width: 4rem;
      }
    }
    &__select_components {
      select {
        width: 10rem;
        height: 100%;
        cursor: pointer;
        &:focus {
          outline: 0;
        }
      }
    }
  }
  &__canvas {
    width: 100%;
    height: 90%;
    margin: 2.4rem auto 0 auto;
    flex-grow: 1;
  }
}
</style>
