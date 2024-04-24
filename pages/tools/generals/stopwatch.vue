<script setup lang="ts">
import { onMounted } from "vue";
import StopWatch from "@/components/templates/tools/generals/StopWatch.vue";
import { useTOUHead } from "@/composables/common/head";
import { TOUColor } from "@/types/common/color/color";
import { TOUFont } from "@/types/common/css/font";

useTOUHead({
  title: "ストップウォッチ",
  description: "時間を計りましょう。",
});

const route = useRoute();
const background = ref(new TOUColor(TOUColor.CODE_WHITE));
const font = ref(
  new TOUFont({
    size: 1,
    weight: "normal",
    family: "メイリオ",
    color: new TOUColor(TOUColor.CODE_BLACK),
  })
);
const position: Ref<"left" | "center" | "right"> = ref("left");

const loadParams = () => {
  const parameter = route.query;
  if (!parameter) {
    return;
  }
  if (parameter.bgColor) {
    background.value.setColor(parameter.bgColor as string);
  }
  if (parameter.bgOpacity) {
    const opacity = Number(parameter.bgOpacity);
    if (!Number.isNaN(opacity)) {
      background.value.setAlpha(opacity);
    }
  }
  if (parameter.fontSize) {
    const size = Number(parameter.fontSize);
    if (!Number.isNaN(size)) {
      font.value.size = size;
    }
  }
  if (parameter.fontColor) {
    font.value.color.setColor(parameter.fontColor as string);
  }
  if (parameter.fontOpacity) {
    const opacity = Number(parameter.fontOpacity);
    if (!Number.isNaN(opacity)) {
      font.value.color.setAlpha(opacity);
    }
  }
  if (parameter.fontWeight) {
    font.value.setWeight(parameter.fontWeight as string);
  }
  if (parameter.fontFamily) {
    font.value.family = parameter.fontFamily as string;
  }
  if (
    parameter.position &&
    ["left", "center", "right"].includes(parameter.position as string)
  ) {
    position.value = parameter.position as "left" | "center" | "right";
  }
};

onMounted(() => {
  loadParams();
});
</script>

<template>
  <StopWatch :bgColor="background" :font="font" :position="position" />
</template>
