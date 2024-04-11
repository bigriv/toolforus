<script setup lang="ts">
const props = defineProps({
  accept: { type: String, default: undefined },
  icon: {
    type: String,
    default: undefined,
  },
  label: {
    type: String,
    default: "",
  },
});

const emits = defineEmits(["change"]);

const isHover = ref(false);
const onChangeFile = (event: Event) => {
  emits("change", event);
};
</script>

<template>
  <label
    class="c-tool_file_button"
    @mouseover="isHover = true"
    @mouseleave="isHover = false"
  >
    <input type="file" :accept="props.accept" @change="onChangeFile" />
    <img :src="props.icon" :alt="props.label" />
    <Transition v-if="props.label">
      <span v-show="isHover" class="c-tool_file_button__label">
        {{ props.label }}
      </span>
    </Transition>
  </label>
</template>

<style scoped lang="scss">
.c-tool_file_button {
  position: relative;
  display: block;
  width: 2.4rem;
  height: 100%;
  background: white;
  border: 0.1rem solid black;
  cursor: pointer;
  &:hover {
    background-color: #eee;
  }
  img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
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
  input[type="file"] {
    appearance: none;
    display: none;
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
