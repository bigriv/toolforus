<script setup lang="ts">
import Idea from "@/components/atoms/ideamap/Idea.vue";
import ToolDataList from "@/components/molecules/interfaces/ToolDataList.vue";
import ToolButton from "@/components/atoms/interfaces/ToolButton.vue";
import { TOUPosition } from "@/types/common/position";
import { TOUIdea } from "@/types/ideamap/idea";

const DEFAULT_IDEA_NAME = "Untitled_1";
const canvas: Ref<HTMLElement | null> = ref(null);
const ideaName = ref(DEFAULT_IDEA_NAME);
const ideaList: Ref<{ [key: string]: TOUIdea }> = ref({});
const ideaMap = ref(new TOUIdea({ position: new TOUPosition() }));
const grabing: Ref<TOUIdea | undefined> = ref(undefined);
const mousedown = ref(false);
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
  {
    icon: "/commons/icons/drag_pan.svg",
    name: "move",
  },
];

const save = () => {
  ideaList.value[ideaName.value] = ideaMap.value;
  localStorage.setItem("tou.ideamap", JSON.stringify(ideaList.value));
};
const onAddIdeaMap = (ideaName: string) => {
  ideaMap.value = new TOUIdea({ position: new TOUPosition() });
  ideaList.value[ideaName] = ideaMap.value;
};
const onEditIdeaMap = (ideaName: string) => {
  ideaMap.value = ideaList.value[ideaName];
  save();
};
const onChangeIdeaMap = (ideaName: string) => {
  ideaMap.value = ideaList.value[ideaName];
};
const onDeleteIdeaMap = (ideaName: string) => {
  ideaMap.value = ideaList.value[ideaName];
  save();
};
const onResetFocus = () => {
  canvasCenter.value.x = 50;
  canvasCenter.value.y = 50;
  lens.value = 100;
};
const onRemoveIdea = (target: TOUIdea) => {
  const remove = (idea: TOUIdea) => {
    if (!idea.children.includes(target)) {
      idea.children.forEach((i) => {
        remove(i);
      });
      return;
    }
    idea.children = idea.children.filter((idea) => idea !== target);
  };
  remove(ideaMap.value);
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
  mousedown.value = false;
};
const onMousemoveCanvas = (event: MouseEvent) => {
  if (!canvas.value) {
    return;
  }

  if (grabing.value) {
    const magni = lens.value / 500;
    grabing.value.position.x +=
      Math.round(
        (event.movementX / canvas.value.offsetWidth) * 100 * magni * 10000
      ) / 10000;
    grabing.value.position.y +=
      Math.round(
        (event.movementY / canvas.value.offsetHeight) * 100 * magni * 10000
      ) / 10000;
    return;
  }
  if (currentTool.value === "move") {
    if (!mousedown.value) {
      return;
    }
    const magni = lens.value / 500;
    canvasCenter.value.x -=
      Math.round(
        (event.movementX / canvas.value.offsetWidth) * 100 * magni * 10000
      ) / 10000;
    canvasCenter.value.y -=
      Math.round(
        (event.movementY / canvas.value.offsetHeight) * 100 * magni * 10000
      ) / 10000;
  }
};
const onMousedownCanvas = (event: MouseEvent) => {
  if (grabing.value) {
    return;
  }
  mousedown.value = true;
  if (currentTool.value === "zoom_in") {
    if (!canvas.value) {
      return;
    }
    canvasCenter.value = new TOUPosition(
      Math.round(
        (event.offsetX / ((canvas.value.offsetWidth / 100) * 5)) * 10000
      ) / 10000,
      Math.round(
        (event.offsetY / ((canvas.value.offsetHeight / 100) * 5)) * 10000
      ) / 10000
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
  mousedown.value = false;
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
  ideaName.value = Object.keys(ideaList.value)[0];
  ideaMap.value = ideaList.value[ideaName.value];
  window.addEventListener("beforeunload", save);
});
onBeforeUnmount(() => {
  window.removeEventListener("beforeunload", save);
  save();
});
</script>

<template>
  <div class="c-container">
    <div class="c-container__toolbar">
      <div class="c-container__toolbar__menu">
        <ToolDataList
          v-model:list="ideaList"
          v-model:selected="ideaName"
          :data="ideaMap"
          @add="onAddIdeaMap"
          @edit="onEditIdeaMap"
          @change="onChangeIdeaMap"
          @delete="onDeleteIdeaMap"
        />
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
            <img src="/commons/icons/recenter.svg" class="u-absolute--center" />
          </ToolButton>
        </div>
      </div>
    </div>

    <div ref="canvas" class="c-container__canvas">
      <div
        class="c-container__canvas__inner"
        :class="{
          'u-mouse_icon--zoom_in': currentTool === 'zoom_in',
          'u-mouse_icon--zoom_out': currentTool === 'zoom_out',
          'u-mouse_icon--move': currentTool === 'move',
          'u-mouse_icon--default': currentTool === 'cursor',
          'u-mouse_icon--grab': grabing,
        }"
        :style="{
          '--lens': lens,
          '--canvasWidth': canvas?.offsetWidth,
          '--canvasHeight': canvas?.offsetHeight,
          '--centerX': canvasCenter.x,
          '--centerY': canvasCenter.y,
        }"
        @mousemove="onMousemoveCanvas"
        @mouseleave="onMouseleaveCanvas"
        @mousedown="onMousedownCanvas"
        @mouseup="onMouseupIdea"
      >
        <Idea
          :depth="0"
          :idea="ideaMap"
          @remove="onRemoveIdea"
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
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  &__toolbar {
    display: flex;
    justify-content: space-between;
    background-color: white;
    &__menu {
      display: flex;
      height: 2rem;
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
    width: 100%;
    margin: auto;
    overflow: hidden;
    background-color: #eee;
    flex-grow: 1;
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
</style>
