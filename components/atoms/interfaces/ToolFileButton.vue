<script setup lang="ts">
const props = defineProps({
  accept: { type: String, default: undefined },
  icon: {
    type: String,
    default: undefined,
  },
});

const emits = defineEmits(["change"]);
const onChangeFile = (event: Event) => {
  emits("change", event);
};
</script>

<template>
  <label>
    <input type="file" :accept="props.accept" @change="onChangeFile" />
    <img :src="props.icon" />
  </label>
</template>

<style scoped lang="scss">
label {
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
  input[type="file"] {
    appearance: none;
    display: none;
  }
}
</style>
