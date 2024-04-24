<script setup lang="ts">
import { ref } from "vue";
import BasicButton from "@/components/atoms/interfaces/BasicButton.vue";
import BasicSelect from "@/components/atoms/interfaces/BasicSelect.vue";
import { useCallApi } from "@/composables/common/call";

const LANGUAGES: Array<{ label: string; value: string }> = [
  { label: "日本語", value: "ja" },
  { label: "英語", value: "en" },
  { label: "中国語", value: "zh" },
  { label: "ロシア語", value: "ru" },
];
const apiPath =
  "https://script.google.com/macros/s/AKfycbxZejSUcrzjj__i1IsAZnyKRuGeUPdOg6TI9daLQV7FvZ1fPw_Gb8xtVO7vfwH2dPIk/exec";

const { callApi } = useCallApi();

const beforeText = ref("");
const afterText = ref("");
const befroreLanguage = ref(LANGUAGES[0].value);
const afterLanguage = ref(LANGUAGES[1].value);

const onTranslate = async () => {
  afterText.value = "翻訳中...";
  callApi({
    method: "GET",
    path: apiPath,
    params: {
      text: beforeText.value,
      source: befroreLanguage.value,
      target: afterLanguage.value,
    },
    sucessFunc: (response: any) => {
      if (!response.data) {
        afterText.value = "翻訳に失敗しました。";
        return;
      }
      if (response.data.code !== 200) {
        afterText.value = "翻訳に失敗しました。";
        return;
      }
      afterText.value = response.data.text;
    },
    failFunc: (response: any) => {
      console.error("To call traslate api failed.", response);
    },
  });
};
</script>

<template>
  <div class="c-translate">
    <div class="c-translate__language">
      <BasicSelect v-model="befroreLanguage" :options="LANGUAGES" />
      <div class="c-translate__language__allow">⇒</div>
      <BasicSelect v-model="afterLanguage" :options="LANGUAGES" />
    </div>
    <div class="c-translate__text">
      <textarea v-model="beforeText" />
      <BasicButton label="翻訳" @click="onTranslate" />
      <textarea v-model="afterText" readonly />
    </div>
  </div>
</template>

<style scoped lang="scss">
.c-translate {
  width: 100%;
  height: 100%;
  min-width: 300px;
  container-type: inline-size;
  &__language {
    display: flex;
    justify-content: space-between;
    height: 2rem;
    select {
      height: 100%;
      cursor: pointer;
    }
    &__allow {
      text-align: center;
      margin: auto;
    }
  }
  &__text {
    display: flex;
    justify-content: space-between;
    textarea {
      resize: none;
      padding: 0.4rem;
      font-size: 1rem;
      font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.1;
      overflow: auto;
    }
    button {
      width: 15%;
      min-width: 6rem;
      height: 2.4rem;
      align-self: center;
      cursor: pointer;
    }
  }
}
@container (max-width: 740px) {
  .c-translate__language {
    select {
      width: 40%;
      min-width: 10em;
    }
    &__allow {
      width: 15%;
      min-width: 1em;
    }
  }
  .c-translate__text {
    flex-direction: column;
    gap: 0.4rem 0;
    textarea {
      width: 100%;
      height: 12rem;
    }
  }
}
@container (min-width: 740px) {
  .c-translate__language {
    select {
      width: 40%;
      min-width: 10em;
    }
    &__allow {
      width: 10%;
      min-width: 1em;
    }
  }
  .c-translate__text {
    flex-direction: row;
    textarea {
      min-width: 10em;
      width: 40%;
      height: 12rem;
    }
  }
}
</style>
