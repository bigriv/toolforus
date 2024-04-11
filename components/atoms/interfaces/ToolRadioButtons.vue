<script setup lang="ts">
import { IdUtils } from "@/types/common/id";

const porps = defineProps({
  selected: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    default: "tool_radio_" + IdUtils.generateUuid(),
  },
  list: {
    type: Array<{
      value: string;
      icon: string;
      label: string;
    }>,
    required: true,
  },
});
const emits = defineEmits(["update:selected", "change"]);

const selected = computed({
  get: () => porps.selected,
  set: (newValue) => emits("update:selected", newValue),
});

const onChange = (event: Event) => {
  emits("change", event);
};
const hovering: Ref<Number | undefined> = ref();
</script>

<template>
  <div
    v-for="(tool, index) in porps.list"
    :key="tool.value"
    class="c-tool_radio_button"
    @mouseover="hovering = index"
    @mouseleave="hovering = undefined"
  >
    <input
      v-model="selected"
      :id="`${name}__${tool.value}`"
      type="radio"
      :name="name"
      :value="tool.value"
      @change="onChange"
    />
    <label :for="`${name}__${tool.value}`">
      <img :src="tool.icon" />
    </label>
    <Transition v-if="tool.label">
      <span v-show="hovering === index" class="c-tool_radio_button__label">
        {{ tool.label }}
      </span>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.c-tool_radio_button {
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
  &__label {
    position: absolute;
    top: 50%;
    left: calc(100% + 1rem);
    padding: 0.4rem 0.8rem;
    background-color: white;
    color: black;
    border: 0.1rem solid black;
    font-size: 1rem;
    white-space: pre;
    z-index: 1;
    transform: translateY(-50%);
  }
}
.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease-in;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
