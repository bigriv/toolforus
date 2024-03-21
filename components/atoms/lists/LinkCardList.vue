<script setup lang="ts">
const props = defineProps({
  contents: {
    type: Array<{ path: String } & any>,
    required: true,
  },
});
</script>

<template>
  <div class="c-link_card_list">
    <NuxtLink v-for="content in props.contents" :to="content.path">
      <div class="c-link_card_list__card">
        <slot :content="content" />
      </div>
    </NuxtLink>
  </div>
</template>

<style scoped lang="scss">
.c-link_card_list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  max-width: 1300px;
  a {
    text-decoration: none;
    color: black;
    width: min(calc(100% - 1rem), 400px);
    max-width: 400px;
    border-radius: 0.5rem;
    border: 0.1rem solid black;
    box-shadow: 0.2rem 0.2rem 0.2rem black;
    transition: all 0.2s ease-out;
    &:hover {
      transform: translate(0.1rem, 0.1rem);
      opacity: 0.8;
    }
  }
}
</style>
