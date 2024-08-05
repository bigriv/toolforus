<script setup lang="ts"></script>

<template>
  <div class="c-loading">
    <img src="/commons/icons/progress_activity.svg" alt="読込中" />
  </div>
</template>

<style scoped lang="scss">
.c-loading {
  position: relative;
  vertical-align: middle;
  width: 100%;
  height: 100%;
  img {
    width: 100%;
    height: 100%;
    animation: rotating-ceeb6e76 2s linear;
    animation-iteration-count: infinite;
  }
}
@keyframes rotating {
  0% {
    transform: rotateZ(0);
  }
  100% {
    transform: rotateZ(360deg);
  }
}
</style>
