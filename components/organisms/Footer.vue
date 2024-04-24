<script setup lang="ts">
const links = [
  {
    label: "利用規約",
    link: "",
  },
  {
    label: "プライバシーポリシー",
    link: "",
  },
  {
    label: "Q&A",
    link: "",
  },
];
</script>

<template>
  <footer>
    <div class="c-footer">
      <div class="c-footer__links">
        <NuxtLink v-for="link in links" class="c-footer__links__link">{{
          link.label
        }}</NuxtLink>
      </div>
    </div>
  </footer>
</template>
<style scoped lang="scss">
.c-footer {
  width: 100%;
  height: 8rem;
  padding: 2% 5%;
  display: flex;
  background: #eee;
  justify-content: center;
  &__links {
    display: flex;
    flex-wrap: nowrap;
    gap: 0.4rem 0.8rem;
    &__link {
      font-size: 0.6rem;
      font-weight: bold;
      text-decoration: underline;
      cursor: pointer;
      &:hover {
        opacity: 0.8;
      }
    }
  }
}
</style>
