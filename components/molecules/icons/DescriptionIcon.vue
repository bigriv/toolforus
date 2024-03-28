<script setup lang="ts">
import BasicBalloon from "@/components/atoms/BasicBalloon.vue";

const props = defineProps({
  icon: {
    type: String as PropType<"info" | "help">,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
});
const icon = computed(() => {
  switch (props.icon) {
    case "info":
      return "/commons/icons/info.svg";
    case "help":
      return "/commons/icons/help.svg";
  }
});
</script>

<template>
  <div class="c-icon">
    <BasicBalloon :content="props.description">
      <img :src="icon" class="u-icon--gray" />
    </BasicBalloon>
  </div>
</template>

<style scoped lang="scss">
.c-icon {
  img {
    vertical-align: middle;
  }
}
</style>
