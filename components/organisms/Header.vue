<script setup lang="ts"></script>

<template>
  <header>
    <NuxtLink to="/" class="c-header"><img src="/commons/logo.png" /></NuxtLink>
  </header>
</template>

<style scoped lang="scss">
.c-header {
  width: 100%;
  height: 5rem;
  padding: 0 5%;
  display: flex;
  &:hover {
    opacity: 0.7;
  }
}
</style>
