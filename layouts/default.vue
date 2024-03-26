<template>
  <OrganismsHeader />
  <main>
    <slot />
  </main>
  <OrganismsFooter />
</template>

<style scoped lang="scss">
main {
  width: 100%;
  height: 100%;
  padding: 2% 5%;
}
</style>
