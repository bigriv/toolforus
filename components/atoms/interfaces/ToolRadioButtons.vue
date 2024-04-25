<script setup lang="ts">
import { IdUtils } from "@/types/common/id";

const props = defineProps({
  selected: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    default: "tool_radio",
  },
  label: {
    type: String,
    default: undefined,
  },
  icon: {
    type: String,
    default: undefined,
  },
  list: {
    type: Array<{
      value: string;
      icon?: string;
      label: string;
    }>,
    required: true,
  },
});
const emits = defineEmits(["update:selected", "change"]);

const name = computed(() => props.name + "_" + IdUtils.generateUuid());
const selected = computed({
  get: () => props.selected,
  set: (newValue) => emits("update:selected", newValue),
});

const onChange = (event: Event) => {
  emits("change", event);
};
const isHoverLabel = ref(false);
const hovering: Ref<Number | undefined> = ref();
</script>

<template>
  <div class="c-tool_radio_buttons">
    <div
      v-if="props.label || props.icon"
      class="c-tool_radio_buttons__head"
      @mouseover="isHoverLabel = true"
      @mouseleave="isHoverLabel = false"
    >
      <img v-if="props.icon" :src="props.icon" />
      <span v-else>{{ props.label }}</span>
      <Transition v-if="props.label && props.icon">
        <span v-show="isHoverLabel" class="c-tool_radio_buttons__head__label">
          {{ props.label }}
        </span>
      </Transition>
    </div>
    <div class="c-tool_radio_buttons__contents">
      <div
        v-for="(tool, index) in props.list"
        :key="tool.value"
        class="c-tool_radio_buttons__contents__content"
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
          <img v-if="tool.icon" :src="tool.icon" />
          <span v-else>{{ tool.label }}</span>
        </label>
        <Transition v-if="tool.icon">
          <span
            v-show="hovering === index"
            class="c-tool_radio_buttons__contents__content__label"
          >
            {{ tool.label }}
          </span>
        </Transition>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.c-tool_radio_buttons {
  position: relative;
  display: flex;
  gap: 0.4rem;
  border: 0.1rem solid black;
  align-items: center;
  height: 2rem;
  padding: 0.2rem;
  user-select: none;
  &__head {
    position: relative;
    img {
      vertical-align: middle;
    }
    span {
      font-size: 0.8rem;
      white-space: pre;
    }
    &__label {
      position: absolute;
      top: 50%;
      left: calc(100% + 1rem);
      padding: 0.4rem 0.8rem;
      background-color: white;
      color: black;
      border: 0.1rem solid black;
      font-size: 0.8rem;
      white-space: pre;
      z-index: 1;
      transform: translateY(-50%);
    }
  }
  &__contents {
    display: flex;
    &__content {
      position: relative;
      input[type="radio"] {
        appearance: none;
        display: none;
        width: 2.4rem;
        height: 1.6rem;
        + label {
          display: block;
          width: 2.4rem;
          height: 1.6rem;
          background-color: white;
          border: 0.1rem solid black;
          cursor: pointer;
          img {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
          span {
            position: absolute;
            width: 100%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            font-size: 0.8rem;
            font-family: monospace;
          }
          &:hover {
            background-color: #eee;
          }
        }
        &:checked + label {
          background-color: #9999ff;
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
        font-size: 0.8rem;
        white-space: pre;
        z-index: 1;
        transform: translateY(-50%);
      }
    }
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
