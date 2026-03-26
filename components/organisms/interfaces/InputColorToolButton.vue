<script setup lang="ts">
import ToolButton from "@/components/atoms/interfaces/ToolButton.vue";
import InputColorModal from "@/components/molecules/modals/InputColorModal.vue";
import { TOUColor } from "@/types/common/color/color";

const props = defineProps({
  color: {
    type: TOUColor,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    default: "",
  },
  // 透明度の選択可否
  inputAlpha: {
    type: Boolean,
    default: true,
  },
});
const emits = defineEmits([
  "update:color",
  "open",
  "close",
  "cancel",
  "submit",
]);

const buttonRef = ref<HTMLElement>();
const modalRef = ref<InstanceType<typeof InputColorModal>>();
const isShowModal = ref(false);
const modalStyle = ref<Record<string, string>>({});

const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);

const color = computed({
  get: () => props.color,
  set: (newValue) => emits("update:color", newValue),
});

watch(isShowModal, (val) => {
  emits(val ? "open" : "close");
});

const openModal = async () => {
  if (!buttonRef.value) return;
  const rect = buttonRef.value.getBoundingClientRect();

  // 一旦非表示で描画してサイズを計測
  modalStyle.value = { top: "0px", left: "0px", visibility: "hidden" };
  isShowModal.value = true;
  await nextTick();

  const el = modalRef.value?.$el as HTMLElement | undefined;
  const mw = el?.offsetWidth ?? 220;
  const mh = el?.offsetHeight ?? 320;
  const margin = 8;

  const rawLeft = (window.innerWidth - rect.right) >= mw ? rect.right : rect.left - mw;
  const rawTop = (window.innerHeight - rect.top) >= mh ? rect.top : rect.bottom - mh;
  const left = clamp(rawLeft, margin, window.innerWidth - mw - margin);
  const top = clamp(rawTop, margin, window.innerHeight - mh - margin);

  modalStyle.value = { top: `${top}px`, left: `${left}px` };
};

const onSubmitColor = (newColor: TOUColor) => {
  color.value = newColor;
  emits("submit");
};
const onCancel = () => {
  emits("cancel");
};
</script>

<template>
  <div
    ref="buttonRef"
    class="c-input_color_tool_button"
    :style="{
      '--color': color.code,
      '--opacity': color.alpha,
    }"
  >
    <ToolButton
      :icon="props.icon"
      :label="props.label"
      @click="openModal"
    />
    <Teleport to="body">
      <InputColorModal
        ref="modalRef"
        v-model:isShowModal="isShowModal"
        :color="color"
        :inputOpacity="props.inputAlpha"
        :style="modalStyle"
        @submit="onSubmitColor"
        @cancel="onCancel"
      />
    </Teleport>
  </div>
</template>

<style scoped lang="scss">
.c-input_color_tool_button {
  position: relative;
  &::after {
    content: "";
    position: absolute;
    top: 1.5rem;
    left: 50%;
    transform: translateX(-50%);
    background-color: var(--color);
    opacity: var(--opacity);
    width: 1em;
    height: 0.2rem;
  }
}
</style>
