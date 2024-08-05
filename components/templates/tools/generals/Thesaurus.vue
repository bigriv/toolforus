<script setup lang="ts">
import { ref } from "vue";
import BasicButton from "@/components/atoms/interfaces/BasicButton.vue";
import CopyIcon from "@/components/molecules/icons/CopyIcon.vue";
import LoadingIcon from "@/components/molecules/icons/LoadingIcon.vue";
import InputText from "@/components/atoms/interfaces/InputText.vue";
import { useCallApi } from "@/composables/common/call";

const { callApi, isCalling } = useCallApi();

const input = ref("");
const mainWord = ref("");
const outputList = ref<string[]>([]);

const onSearch = async () => {
  if (!input.value) {
    outputList.value = [];
  }
  if (mainWord.value === input.value) {
    return;
  }
  mainWord.value = input.value;
  await callApi({
    method: "POST",
    path: "https://asia-northeast1-creatriver-59a53.cloudfunctions.net/thesaurus-api",
    headers: {
      "Content-Type": "application/json",
    },
    params: {
      text: mainWord.value,
    },
    sucessFunc: (response: any) => {
      console.log(response.data);
      if (!Array.isArray(response.data)) {
        return;
      }
      outputList.value = response.data;
    },
    failFunc: (response: any) => {
      console.log(response);
    },
  });
};
</script>

<template>
  <div class="c-thesaurus">
    <div class="c-thesaurus__text">
      <InputText
        v-model:text="input"
        :maxlength="100"
        placeholder="Enterで類語を取得"
        @keydown.enter="onSearch"
      />
      <BasicButton label="類語を取得" @click="onSearch" />
    </div>
    <div v-if="mainWord" class="u-mgt-4">
      <p>「{{ mainWord }}」の類語</p>
      <div v-show="isCalling" class="c-thesaurus__loading">
        <LoadingIcon />
      </div>
      <dl
        class="c-thesaurus__result u-mgt-3"
        v-for="output in outputList"
        :key="output"
      >
        <dd class="c-thesaurus__result__word">
          {{ output }}
          <div class="c-thesaurus__result__word__copy">
            <CopyIcon :content="output" />
          </div>
        </dd>
      </dl>
    </div>
  </div>
</template>

<style scoped lang="scss">
.c-thesaurus {
  width: 100%;
  min-width: 300px;
  container-type: inline-size;
  &__text {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10%;
    textarea {
      width: 75%;
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
  &__loading {
    width: 2rem;
    aspect-ratio: 1;
  }
  &__result {
    &__word {
      font-size: 1rem;
      &__copy {
        width: 1rem;
        display: inline-block;
      }
    }
    &__description {
      font-size: 0.8rem;
      line-height: 1;
    }
  }
}
</style>
