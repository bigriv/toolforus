<script setup lang="ts">
import { onMounted } from "vue";
import StopWatch from "@/components/templates/generals/StopWatch.vue";
import { TOURGBColor } from "@/types/common/css/color";
import { TOUFont } from "@/types/common/css/font";

const route = useRoute();
const background = ref(new TOURGBColor(TOURGBColor.CODE_WHITE));
const font = ref(
  new TOUFont({
    size: 1,
    weight: "normal",
    family: "Meiryo",
    color: new TOURGBColor(TOURGBColor.CODE_BLACK),
  })
);
const buttonPosition = ref("right");

const loadParams = () => {
  const parameter = route.query;
  console.log(parameter);
  if (!parameter) {
    return;
  }
  if (parameter.bgColor) {
    background.value.setCode(parameter.bgColor as string);
  }
  if (parameter.bgOpacity) {
    const opacity = Number(parameter.bgOpacity);
    if (!Number.isNaN(opacity)) {
      background.value.setOpacity(opacity);
    }
  }
  if (parameter.fontSize) {
    const size = Number(parameter.fontSize);
    if (!Number.isNaN(size)) {
      font.value.size = size;
    }
  }
  if (parameter.fontColor) {
    font.value.color.setCode(parameter.fontColor as string);
  }
  if (parameter.fontOpacity) {
    const opacity = Number(parameter.fontOpacity);
    if (!Number.isNaN(opacity)) {
      font.value.color.setOpacity(opacity);
    }
  }
  if (parameter.fontWeight) {
    font.value.setWeight(parameter.fontWeight as string);
  }
  if (parameter.fontFamily) {
    font.value.family = parameter.fontFamily as string;
  }
  if (parameter.buttonPosition) {
    buttonPosition.value = parameter.buttonPosition as string;
  }
};

onMounted(() => {
  loadParams();
});
</script>

<template>
  <StopWatch :bgColor="background" :font="font" :button="buttonPosition" />
</template>
