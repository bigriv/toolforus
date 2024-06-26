<script setup lang="ts">
import InputText from "@/components/atoms/interfaces/InputText.vue";
import { TOUIdea } from "@/types/tools/generals/ideamap/idea";

const props = defineProps({
  depth: {
    type: Number,
    required: true,
  },
  idea: {
    type: TOUIdea,
    required: true,
  },
});

const emits = defineEmits(["change", "add", "remove", "mousedown", "mouseup"]);

const onMousedown = () => {
  emits("mousedown", props.idea);
};
const onMouseup = () => {
  emits("mouseup");
};
const onChange = () => {
  emits("change");
};
const onRemove = () => {
  emits("remove", props.idea);
};
const onAdd = () => {
  if (props.idea.children.length >= 8) {
    return;
  }
  emits("add", props.idea);
};
const emitRemove = (target: TOUIdea) => {
  emits("remove", target);
};
const emitAdd = (parent: TOUIdea) => {
  emits("add", parent);
};
const emitMousedown = (parent: TOUIdea) => {
  emits("mousedown", parent);
};
const emitMouseup = () => {
  emits("mouseup");
};
</script>

<template>
  <div
    class="c-idea"
    :style="{
      width: props.idea.width + '%',
      height: props.idea.height + '%',
      '--x': props.idea.position.x,
      '--y': props.idea.position.y,
    }"
    @mousedown="onMousedown"
    @mouseup="onMouseup"
    @click.prevent.stop
  >
    <div class="c-idea__text">
      <InputText
        v-model:text="props.idea.text"
        :maxlength="100"
        @blur="onChange"
        @mousedown.stop
      />
    </div>
    <div
      v-if="depth > 0 && props.idea.children.length <= 0"
      class="c-idea__remove"
      @click="onRemove"
    >
      <img src="/commons/icons/remove.svg" alt="削除" />
    </div>
    <div class="c-idea__add" @click="onAdd">
      <img src="/commons/icons/add.svg" alt="子を追加" />
    </div>
  </div>
  <template v-for="child in props.idea.children">
    <Idea
      :depth="props.depth + 1"
      :idea="child"
      @add="emitAdd"
      @remove="emitRemove"
      @mousedown="emitMousedown"
      @mouseup="emitMouseup"
    />
    <div
      class="c-idea__line"
      :style="{
        '--fromX': props.idea.position.x,
        '--fromY': props.idea.position.y,
        '--toX': child.position.x,
        '--toY': child.position.y,
      }"
    ></div>
  </template>
</template>

<style scoped lang="scss">
.c-idea {
  position: absolute;
  top: calc(var(--y) * 1% + 50%);
  left: calc(var(--x) * 1% + 50%);
  transform: translate(-50%, -50%);
  font-size: 1rem;
  border-radius: 50%;
  border: 0.1rem solid black;
  background: white;
  cursor: grab;
  user-select: none;
  &__text {
    position: absolute;
    text-align: center;
    color: black;
    width: 80%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  &__remove,
  &__add {
    width: 1rem;
    height: 1rem;
    border: 0.1rem solid black;
    border-radius: 50%;
    background: white;
    position: absolute;
    cursor: pointer;
    opacity: 0.5;
    &:hover {
      opacity: 1;
    }
    img {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }
  }
  &__remove {
    top: 0;
    right: 1.2rem;
    transform: translate(50%, -50%);
  }
  &__add {
    top: 0;
    right: 0;
    transform: translate(50%, -50%);
  }
  &__line {
    position: absolute;
    top: calc(var(--fromY) * 1% + 50%);
    left: calc(var(--fromX) * 1% + 50%);
    background-color: black;
    border: 0.1rem solid black;
    --diffX: calc((var(--fromX) - var(--toX)));
    --diffY: calc(
      (var(--fromY) - var(--toY)) * var(--canvasHeight) / var(--canvasWidth)
    );
    --radias: sqrt(var(--diffX) * var(--diffX) + var(--diffY) * var(--diffY));
    --deg: atan2(var(--diffY), var(--diffX));
    width: calc(var(--radias) * 1%);
    height: 0.1rem;
    transform: rotateZ(var(--deg)) translate(-100%, -50%);
    transform-origin: center left;
    z-index: -1;
  }
  &:deep(input[type="text"]) {
    border: none;
    background: transparent;
    text-align: center;
    user-select: none;
    &:focus {
      border: 0.1rem solid black;
      text-align: left;
      user-select: auto;
    }
  }
}
</style>
