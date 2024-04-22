<script setup lang="ts">
const onMoveTop = () => {
  const header = document.getElementById("header");
  if (!header) {
    return;
  }
  header.scrollIntoView({
    block: "start",
    behavior: "smooth",
  });
};
</script>

<template>
  <div class="c-move_top" @click="onMoveTop">
    <img src="/commons/icons/arrow_circle_up.svg" alt="ページトップに移動" />
  </div>
</template>

<style scoped lang="scss">
.c-move_top {
  position: fixed;
  bottom: 10%;
  right: 5%;
  width: 5%;
  height: 5%;
  cursor: pointer;
  opacity: 0.2;
  &:hover {
    opacity: 0.6;
  }
  img {
    width: 100%;
    height: 100%;
    filter: drop-shadow(0.2rem 0.2rem 0.1rem #888);
  }
}
</style>
