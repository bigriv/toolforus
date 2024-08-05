<script setup lang="ts">
import { ref } from "vue";
import BasicButton from "@/components/atoms/interfaces/BasicButton.vue";
import CopyIcon from "@/components/molecules/icons/CopyIcon.vue";
import InputText from "~/components/atoms/interfaces/InputText.vue";

const input = ref("");
const mainWord = ref("");
const outputList = ref<{ word: string; description: string }[]>([]);
const fetch = () => {
  outputList.value = [
    {
      word: "ジャパン",
      description: "日本の英語表記「Japan」のカタカナ読み。",
    },
    {
      word: "ジャパン",
      description: "日本の英語表記「Japan」のカタカナ読み。",
    },
    {
      word: "日の昇る国",
      description:
        "飛鳥時代、聖徳太子が清の国に小野妹子を遣隋使として送った際、持たせた文書に記されていた日本の表記。",
    },
  ];
};

const onSearch = () => {
  alert("keydown enter");
  if (!input.value) {
    outputList.value = [];
  }
  if (mainWord.value === input.value) {
    return;
  }
  mainWord.value = input.value;
  fetch();
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
      <dl
        class="c-thesaurus__result u-mgt-3"
        v-for="output in outputList"
        :key="output.word"
      >
        <dd class="c-thesaurus__result__word">
          {{ output.word }}
          <div class="c-thesaurus__result__word__copy">
            <CopyIcon :content="output.word" />
          </div>
        </dd>
        <dd class="c-thesaurus__result__description">
          {{ output.description }}
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
