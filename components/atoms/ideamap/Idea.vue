<script setup lang="ts">
import InputText from "@/components/atoms/interfaces/InputText.vue";
import { TOUIdea } from "@/types/ideamap/idea";

const props = defineProps({
  idea: {
    type: TOUIdea,
    required: true,
  },
});

const emits = defineEmits(["change", "add", "mousedown", "mouseup"]);

const onMousedown = () => {
  emits("mousedown", props.idea);
};
const onMouseup = () => {
  emits("mouseup");
};
const onChange = () => {
  emits("change");
};
const onAdd = () => {
  if (props.idea.children.length >= 8) {
    return;
  }
  emits("add", props.idea);
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
    <div class="c-idea__add" @click="onAdd">
      <img src="/commons/icons/add.svg" alt="子を追加" />
    </div>
  </div>
  <template v-for="child in props.idea.children">
    <Idea
      :idea="child"
      @add="emitAdd"
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
  &__add {
    width: 1rem;
    height: 1rem;
    border: 0.1rem solid black;
    border-radius: 50%;
    background: white;
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(50%, -50%);
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
  &__line {
    position: absolute;
    top: calc(var(--fromY) * 1% + 50%);
    left: calc(var(--fromX) * 1% + 50%);
    background-color: black;
    border: 0.1rem solid black;
    --diffX: calc(var(--fromX) - var(--toX));
    --diffY: calc(var(--fromY) - var(--toY));
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
    &:focus {
      border: 0.1rem solid black;
      text-align: left;
    }
  }
}
</style>
