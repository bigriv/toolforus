<script setup lang="ts">
import LinkCardList from "@/components/atoms/lists/LinkCardList.vue";
import BasicButton from "@/components/atoms/interfaces/BasicButton.vue";
import IntroductionTree from "@/components/templates/IntroductionTree.vue";
import { useTOUHead } from "@/composables/common/head";

useTOUHead({
  title: "トップ",
  description:
    "会員登録不要、無料で利用。汎用ツールから色の検索まで多種多様なツールを用意。複数のツールをひとつの画面にカスタマイズ",
});

const contents = [
  {
    title: "一般",
    contents: [
      {
        title: "ストップウォッチ",
        path: "/tools/generals/stopwatch",
        description: "時間を計りましょう。",
      },
      {
        title: "メモ帳",
        path: "/tools/generals/note",
        description: "シンプルにメモしましょう。保存可能。",
      },
      {
        title: "手書きメモ",
        path: "/tools/generals/freehand",
        description: "手書きでメモしましょう。",
      },
      {
        title: "翻訳機",
        path: "/tools/generals/translate",
        description: "いくつかの言語を翻訳しましょう。",
      },
      {
        title: "アイデアマップ",
        path: "/tools/generals/ideamap",
        description:
          "単語の連想を広げて新しいアイデアを出しましょう。保存可能。",
      },
      {
        title: "統合",
        path: "/tools/generals/integrater",
        description: "全てのツールを一画面で管理しましょう。保存可能。",
      },
    ],
  },
  {
    title: "デザイン",
    contents: [
      {
        title: "カラーコンパニオン",
        path: "/tools/designs/colorcompanion",
        description: "良い色の組み合わせを見つけてみましょう。",
      },
      {
        title: "色検索",
        path: "/tools/designs/colorsearcher",
        description: "イメージから色を検索してみましょう。",
      },
      {
        title: "簡易画像編集",
        path: "/tools/designs/iie",
        description: "簡単な画像編集をやってみましょう。",
      },
    ],
  },
];

const isShowIntroductionDiagram = ref(false);

const onClickUse = () => {
  const toolsTop = document.getElementById("category_1");
  if (!toolsTop) {
    return;
  }
  toolsTop.scrollIntoView({
    block: "start",
    behavior: "smooth",
  });
};

onMounted(() => {
  setTimeout(() => {
    isShowIntroductionDiagram.value = true;
  }, 500);
});
</script>

<template>
  <div class="c-contents">
    <div class="c-contents__introduction">
      <div class="c-contents__introduction__diagram">
        <IntroductionTree v-if="isShowIntroductionDiagram" />
      </div>
      <div class="c-contents__introduction__text">
        <p>創造の秘密基地</p>
        <span class="u-mgt-4"> 会員登録不要、無料で利用 </span>
        <span> 汎用ツールから色の検索まで多種多様なツールを用意 </span>
        <span> 複数のツールをひとつの画面にカスタマイズ </span>
        <div class="c-contents__introduction__text__buttons u-mgt-4">
          <BasicButton label="使ってみる" @click="onClickUse" />
          <!-- <BasicButton label="詳しい利用方法" /> -->
        </div>
      </div>
    </div>
    <div
      v-for="(category, index) in contents"
      :id="`category_${index}`"
      class="c-contents__category"
    >
      <span class="c-contents__category__title">{{ category.title }}</span>
      <LinkCardList
        :contents="category.contents"
        class="c-contents__category__cards"
      >
        <template v-slot:default="slotProps">
          <div class="c-contents__card">
            <div class="c-contents__card__title">
              {{ slotProps.content.title }}
            </div>
            <div class="c-contents__card__description u-mgt-1">
              {{ slotProps.content.description }}
            </div>
          </div>
        </template>
      </LinkCardList>
    </div>
  </div>
</template>

<style scoped lang="scss">
.c-contents {
  &__introduction {
    width: 100%;
    position: relative;
    &__text {
      position: absolute;
      top: 4rem;
      left: 0;
      font-family: "Klee One", sans-serif;
      animation: UnblurFadein 1s ease-out;
      span {
        display: block;
      }
      &__buttons {
        display: flex;
        justify-content: space-between;
        gap: 10%;
        button {
          width: 40%;
        }
      }
    }
    &__diagram {
      position: absolute;
      top: 0;
      &::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.5);
      }
    }
  }
  &__category {
    font-family: "Klee One", sans-serif;
    font-size: 1.4rem;
    min-width: 20rem;
    &__title {
      background: white;
    }
    &__cards {
      margin-top: -0.6rem;
      border: 0.1rem solid #aaa;
      padding: 1.2rem;
      font-family: sans-serif;
    }
  }
  &__category + &__category {
    margin-top: 0.8rem;
  }
  &__card {
    padding: 0.4rem;
    &__title {
      font-size: 1rem;
      font-weight: bold;
    }
    &__description {
      font-size: 1.2rem;
      font-family: "Klee One", sans-serif;
    }
  }
}
@media screen and (max-width: 419px) {
  // スマホ用
  .c-contents {
    &__introduction {
      height: 20rem;
      &__text {
        width: 20rem;
        p {
          font-size: 2rem;
        }
        span {
          font-size: 1rem;
        }
        &__buttons {
          width: 20rem;
        }
      }
      &__diagram {
        width: 20rem;
        left: 0;
      }
    }
  }
}
@media screen and (min-width: 420px) {
  // PC・タブレット用
  .c-contents {
    &__introduction {
      height: 30rem;
      &__text {
        width: 40rem;
        p {
          font-size: 3.2rem;
        }
        span {
          font-size: 1.6rem;
        }
        &__buttons {
          width: 30rem;
        }
      }
      &__diagram {
        width: 30rem;
        left: calc(50% - 15rem);
      }
    }
  }
}
</style>
