<script setup lang="ts">
import BasicBalloon from "@/components/atoms/BasicBalloon.vue";

const props = defineProps({
  content: {
    type: String,
    default: undefined,
  },
});
const emits = defineEmits(["copy"]);
const onCopy = () => {
  if (props.content) {
    navigator.clipboard.writeText(props.content);
  }
  emits("copy");
};
</script>

<template>
  <div class="c-copy" @click="onCopy">
    <BasicBalloon content="コピーしました。" timming="click">
      <img src="/commons/icons/copy.svg" alt="コピー" />
    </BasicBalloon>
  </div>
</template>

<style scoped lang="scss">
.c-copy {
  position: relative;
  cursor: pointer;
  vertical-align: middle;
  width: 100%;
  height: 100%;
  img {
    width: 100%;
    height: 100%;
  }
  &:hover {
    background: #ddd;
  }
}
</style>
