<script setup lang="ts">
import Idea from "@/components/atoms/ideamap/Idea.vue";
import InputText from "@/components/atoms/interfaces/InputText.vue";
import ToolButton from "@/components/atoms/interfaces/ToolButton.vue";
import { TOUPosition } from "@/types/common/position";
import { TOUIdea } from "@/types/ideamap/idea";

const DEFAULT_IDEA_NAME = "Untitled_1";
const ideaName = ref(DEFAULT_IDEA_NAME);
const ideaList: Ref<{ [key: string]: TOUIdea }> = ref({});
const isSubmitable = computed(() => !ideaList.value[edit.after]);
const isDeletable = computed(() => Object.keys(ideaList.value).length > 1);
const edit = reactive({
  isEditing: false,
  before: "",
  after: "",
});
const ideaMap = ref(new TOUIdea({ position: new TOUPosition() }));
const grabing: Ref<TOUIdea | undefined> = ref(undefined);
const lens = ref(100);
const canvasCenter = ref(new TOUPosition(50, 50));
const currentTool = ref("cursor");
const toolList = [
  {
    icon: "/commons/icons/cursor.svg",
    name: "cursor",
  },
  {
    icon: "/commons/icons/zoom_in.svg",
    name: "zoom_in",
  },
  {
    icon: "/commons/icons/zoom_out.svg",
    name: "zoom_out",
  },
];

const save = () => {
  ideaList.value[ideaName.value] = ideaMap.value;
  localStorage.setItem("tou.ideamap", JSON.stringify(ideaList.value));
};
const onChangeNote = (e: Event) => {
  save();
  ideaName.value = (e.target as HTMLSelectElement).value;
  ideaMap.value = ideaList.value[ideaName.value];
};
const onEdit = () => {
  edit.isEditing = true;
  edit.before = ideaName.value;
  edit.after = ideaName.value;
};
const onAddMap = () => {
  save();
  const keyList = Object.keys(ideaList.value)
    .filter((key) => /^Untitled_\d+$/.test(key))
    .map((key) => key.replace(/^Untitled_/, ""));
  let max = 1;
  for (const key of keyList) {
    const num = Number(key);
    if (Number.isNaN(num)) {
      continue;
    }
    if (num > max) {
      max = num;
    }
  }
  ideaName.value = "Untitled_" + (max + 1);
  ideaMap.value = new TOUIdea({ position: new TOUPosition() });
  ideaList.value[ideaName.value] = ideaMap.value;
};
const onEditSave = () => {
  edit.isEditing = false;
  if (edit.before === edit.after) {
    return;
  }
  ideaList.value[edit.after] = ideaList.value[edit.before];
  delete ideaList.value[edit.before];
  ideaName.value = edit.after;
};
const onEditCancel = () => {
  edit.isEditing = false;
  edit.before = "";
  edit.after = "";
};
const onDelete = () => {
  edit.isEditing = false;
  delete ideaList.value[edit.before];
  ideaName.value = Object.keys(ideaList.value)[0];
  ideaMap.value = ideaList.value[ideaName.value];
};
const onResetFocus = () => {
  canvasCenter.value.x = 50;
  canvasCenter.value.y = 50;
  lens.value = 100;
};
const onAddIdea = (parent: TOUIdea) => {
  const newIdea = new TOUIdea({
    position: new TOUPosition(parent.position.x, parent.position.y),
  });
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) {
        continue;
      }
      newIdea.position = new TOUPosition(
        parent.position.x + parent.width * 1.5 * j,
        parent.position.y + parent.height * 1.5 * i
      );
      if (!ideaMap.value.isOverwarap(newIdea)) {
        // 他のアイデアと衝突しない位置ならその場所に子を追加
        parent.children.push(newIdea);
        return;
      }

      if (i === 1 && j === 1) {
        // 八方向すべてに衝突するオブジェクトがある場合は子を追加せずに終了
        return;
      }
    }
  }
};
const onMousedownIdea = (idea: TOUIdea) => {
  grabing.value = idea;
};
const onMouseupIdea = () => {
  grabing.value = undefined;
};
const onMousemoveCanvas = (event: MouseEvent) => {
  if (!grabing.value) {
    return;
  }
  grabing.value.position.x +=
    Math.round((event.movementX / 5 / 500) * lens.value * 10000) / 10000;
  grabing.value.position.y +=
    Math.round((event.movementY / 6 / 500) * lens.value * 10000) / 10000;
};
const onMousedownCanvas = (event: MouseEvent) => {
  if (grabing.value) {
    return;
  }
  if (currentTool.value === "zoom_in") {
    canvasCenter.value = new TOUPosition(
      Math.round((event.offsetX / (5 * 5)) * 10000) / 10000,
      Math.round((event.offsetY / (6 * 5)) * 10000) / 10000
    );
    if (lens.value >= 500) {
      return;
    }
    lens.value += 20;
  } else if (currentTool.value === "zoom_out") {
    if (lens.value < 20) {
      return;
    }
    lens.value -= 20;
  }
};
const onMouseleaveCanvas = () => {
  grabing.value = undefined;
};
const onUpCanvas = () => {
  canvasCenter.value.y -= 100 / lens.value;
};
const onDownCanvas = () => {
  canvasCenter.value.y += 100 / lens.value;
};
const onLeftCanvas = () => {
  canvasCenter.value.x -= 100 / lens.value;
};
const onRightCanvas = () => {
  canvasCenter.value.x += 100 / lens.value;
};

onMounted(() => {
  const object = JSON.parse(
    JSON.parse(JSON.stringify(localStorage.getItem("tou.ideamap")))
  );
  if (!object || Object.keys(object).length <= 0) {
    ideaList.value[ideaName.value] = ideaMap.value;
    return;
  }
  for (const key of Object.keys(object)) {
    ideaList.value[key] = TOUIdea.build(object[key]);
  }
  if (!Object.keys(object).includes(DEFAULT_IDEA_NAME)) {
    ideaList.value[DEFAULT_IDEA_NAME] = ideaMap.value;
  }
});
onUnmounted(() => {
  save();
});
</script>

<template>
  <div class="c-container">
    <div class="c-container__toolbar">
      <div class="c-container__toolbar__menu">
        <div
          v-if="edit.isEditing"
          class="c-container__toolbar__menu__edit_input"
        >
          <InputText v-model:text="edit.after" />
        </div>
        <div v-else class="c-container__toolbar__menu__idea_list">
          <select :value="ideaName" @change.prevent.stop="onChangeNote">
            <option v-for="(__idea, name) in ideaList" :key="name">
              {{ name }}
            </option>
          </select>
        </div>
        <template v-if="edit.isEditing">
          <div>
            <ToolButton :disabled="!isSubmitable" @click="onEditSave">
              <img src="/commons/icons/flag.svg" alt="保存" />
            </ToolButton>
          </div>
          <div>
            <ToolButton @click="onEditCancel">
              <img
                class="u-icon--red"
                src="/commons/icons/close.svg"
                alt="キャンセル"
              />
            </ToolButton>
          </div>
          <div>
            <ToolButton :disabled="!isDeletable" @click="onDelete">
              <img
                class="u-icon--red"
                src="/commons/icons/delete.svg"
                alt="削除"
              />
            </ToolButton>
          </div>
        </template>
        <template v-else>
          <div>
            <ToolButton @click="onEdit">
              <img src="/commons/icons/pen.svg" alt="編集" />
            </ToolButton>
          </div>
          <div>
            <ToolButton @click="onAddMap">
              <img src="/commons/icons/add.svg" alt="新規" />
            </ToolButton>
          </div>
        </template>
      </div>
    </div>
    <div class="c-container__toolbar">
      <div class="c-container__toolbar__menu">
        <template v-for="tool in toolList">
          <div class="c-container__toolbar__menu__tool">
            <input
              v-model="currentTool"
              :id="`tool__${tool.name}`"
              type="radio"
              name="tool"
              :value="tool.name"
            />
            <label :for="`tool__${tool.name}`">
              <img :src="tool.icon" />
            </label>
          </div>
        </template>
        <div>
          <ToolButton @click="onResetFocus">
            <img src="/commons/icons/recenter.svg" />
          </ToolButton>
        </div>
      </div>
    </div>

    <div class="c-container__canvas">
      <div
        class="c-container__canvas__inner"
        :class="{
          'u-mouse_icon--zoom_in': currentTool === 'zoom_in',
          'u-mouse_icon--zoom_out': currentTool === 'zoom_out',
          'u-mouse_icon--default': currentTool === 'cursor',
          'u-mouse_icon--grab': grabing,
        }"
        :style="{
          '--lens': lens,
          '--centerX': canvasCenter.x,
          '--centerY': canvasCenter.y,
        }"
        @mousemove="onMousemoveCanvas"
        @mouseleave="onMouseleaveCanvas"
        @mousedown="onMousedownCanvas"
        @mouseup="onMouseupIdea"
      >
        <Idea
          :idea="ideaMap"
          @add="onAddIdea"
          @mousedown="onMousedownIdea"
          @mouseup="onMouseupIdea"
        />
      </div>
      <button
        class="c-container__canvas__button--up"
        @click="onUpCanvas"
      ></button>
      <button
        class="c-container__canvas__button--down"
        @click="onDownCanvas"
      ></button>
      <button
        class="c-container__canvas__button--left"
        @click="onLeftCanvas"
      ></button>
      <button
        class="c-container__canvas__button--right"
        @click="onRightCanvas"
      ></button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.c-container {
  margin: auto;
  width: 500px;
  &__toolbar {
    display: flex;
    justify-content: space-between;
    background-color: white;
    &__menu {
      display: flex;
      height: 2rem;
      &__edit_input {
        width: 10rem;
        height: 100%;
      }
      &__idea_list {
        select {
          width: 10rem;
          height: 100%;
          cursor: pointer;
          &:focus {
            outline: 0;
          }
        }
      }
      &__button {
        width: 4rem;
      }
      &__tool {
        position: relative;
        input[type="radio"] {
          appearance: none;
          display: none;
          width: 2.4rem;
          height: 100%;
          + label {
            display: block;
            width: 2.4rem;
            height: 100%;
            background-color: white;
            border: 0.1rem solid black;
            cursor: pointer;
            img {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            }
            &:hover {
              background-color: #eee;
            }
          }
          &:checked + label {
            background-color: #ffaaaa;
          }
        }
      }
    }
  }
  &__canvas {
    position: relative;
    border: 0.1rem solid black;
    width: 500px;
    height: 600px;
    margin: auto;
    overflow: hidden;
    background-color: #eee;
    &__button {
      &--up,
      &--down,
      &--left,
      &--right {
        position: absolute;
        border: none;
        background-color: #eee;
        opacity: 0.5;
        cursor: pointer;
        &:hover {
          opacity: 1;
        }
        &::before {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          width: 1rem;
          background: black;
          aspect-ratio: 1;
          transform: translate(-50%, -50%);
        }
      }
      &--up {
        top: 0;
        left: 10%;
        width: 80%;
        height: 1.4rem;
        &::before {
          clip-path: polygon(50% 0, 100% 100%, 0 100%);
        }
      }
      &--down {
        bottom: 0;
        left: 10%;
        width: 80%;
        height: 1.4rem;
        &::before {
          clip-path: polygon(50% 100%, 100% 0, 0 0);
        }
      }
      &--left {
        top: 10%;
        left: 0;
        width: 1.4rem;
        height: 80%;
        &::before {
          clip-path: polygon(0 50%, 100% 0, 100% 100%);
        }
      }
      &--right {
        top: 10%;
        right: 0;
        width: 1.4rem;
        height: 80%;
        &::before {
          clip-path: polygon(0 0, 100% 50%, 0 100%);
        }
      }
    }
    &__inner {
      position: absolute;
      top: calc(100% - var(--centerY) * 1%);
      left: calc(100% - var(--centerX) * 1%);
      width: 500%;
      height: 500%;
      transform: translate(
          calc(var(--centerX) * -1%),
          calc(var(--centerY) * -1%)
        )
        scale(calc(var(--lens) / 100), calc(var(--lens) / 100));
      background-color: #fff;
    }
  }
}
.u-icon--red {
  filter: invert(15%) sepia(95%) saturate(6932%) hue-rotate(358deg)
    brightness(95%) contrast(112%);
}
.u-mouse_icon--zoom_in {
  cursor:
    url("/commons/icons/zoom_in.svg") 0 16,
    auto;
}
.u-mouse_icon--zoom_out {
  cursor:
    url("/commons/icons/zoom_out.svg") 0 16,
    auto;
}
.u-mouse_icon--default {
  cursor: default;
}
.u-mouse_icon--grab {
  cursor: grab;
}
</style>
