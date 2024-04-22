import { useCallApi } from "@/composables/common/call";
import { TOUColor, TOUHSBColor } from "@/types/common/color/color";
import { TOUColorTone } from "@/types/common/color/tone";

export const useColorCompanionSearch = () => {
  const { callApi, isCalling } = useCallApi();

  type ColorTagSelection = {
    value: string;
    label: string;
    checked: boolean;
  };
  const colorTagSelections: Ref<ColorTagSelection[]> = ref([
    { checked: false, value: "VIVID", label: "派手・鮮やか" },
    { checked: false, value: "ENERGY", label: "元気・エネルギッシュ" },
    { checked: false, value: "SIMPLE", label: "地味" },
    { checked: false, value: "BRIGHT", label: "明るい" },
    { checked: false, value: "DARK", label: "暗い" },
    { checked: false, value: "POWERFUL", label: "パワフル・力強い" },
    { checked: false, value: "WEAK", label: "はかない・弱弱しい" },
    { checked: false, value: "HEAVY", label: "重厚感" },
    { checked: false, value: "STABLE", label: "落ち着き・安定感" },
    { checked: false, value: "FRIENDLY", label: "親しみやすい" },
    { checked: false, value: "CLEAR", label: "清潔感・透明感" },
    { checked: false, value: "FRESH", label: "爽やか" },
    { checked: false, value: "LOVELY", label: "子供らしさ・可愛らしさ" },
    { checked: false, value: "SOFT", label: "柔らかい" },
    { checked: false, value: "CALMNESS", label: "優しさ・穏やかさ" },
    { checked: false, value: "DEEP", label: "深い" },
    { checked: false, value: "BITTER", label: "渋い" },
    { checked: false, value: "MATURE", label: "大人っぽさ" },
    { checked: false, value: "CLASSIC", label: "クラシック・伝統的" },
    { checked: false, value: "ELEGANCE", label: "優雅さ・上品さ" },
    { checked: false, value: "LUXURY", label: "高級感" },
    { checked: false, value: "DULL", label: "くすんだ・濁った" },
    { checked: false, value: "CASUAL", label: "カジュアル" },
    { checked: false, value: "FORMAL", label: "厳か・フォーマル" },
    { checked: false, value: "NATURAL", label: "自然・ナチュラル" },
    { checked: false, value: "JAPANESE", label: "和風" },
    { checked: false, value: "RETRO", label: "レトロ" },
    { checked: false, value: "MODERN", label: "モダン" },
    { checked: false, value: "BASIC", label: "ベーシック" },
  ]);

  type ColorOption = {
    id: string;
    hue: number;
    label: string;
  };
  const colorOptions: ColorOption[] = [
    { id: "h-0", hue: 0, label: "赤" },
    { id: "h-30", hue: 30, label: "橙" },
    { id: "h-60", hue: 60, label: "黄" },
    { id: "h-90", hue: 90, label: "黄緑" },
    { id: "h-120", hue: 120, label: "緑" },
    // { id: "h-150", hue: 150, label: "緑青" }, 直感的な色ではないので非表示
    { id: "h-180", hue: 180, label: "シアン" },
    // { id: "h-210", hue: 210, label: "青緑" }, 直感的な色ではないので非表示
    { id: "h-240", hue: 240, label: "青" },
    { id: "h-270", hue: 270, label: "青紫" },
    { id: "h-300", hue: 300, label: "ピンク" },
    { id: "h-330", hue: 330, label: "赤紫" },
  ];

  const selectingTag: Ref<ColorTagSelection[]> = ref([]);
  const selectingColor: Ref<ColorOption> = ref(colorOptions[0]);
  const suggestColorList: Ref<TOUColor[]> = ref([]);
  let toneDefine: { [key: string]: TOUColorTone[] } | undefined = undefined;

  const getToneDefine = async (): Promise<{
    [key: string]: TOUColorTone[];
  }> => {
    if (toneDefine) {
      return toneDefine;
    }
    await callApi({
      method: "GET",
      path: "/datas/color/tone.json",
      sucessFunc: (response: any) => {
        if (!response.data) {
          return;
        }
        toneDefine = response.data;
      },
    });

    if (!toneDefine) {
      throw new Error("To get tone define was fialed.");
    }
    return toneDefine;
  };

  const isTagRelateTone = (tone: string[]): boolean => {
    for (const tag of selectingTag.value) {
      if (!tone.includes(tag.value)) {
        return false;
      }
    }
    return true;
  };

  const onSearchColor = async () => {
    toneDefine = await getToneDefine();

    let toneList = [];
    for (const key of Object.keys(toneDefine)) {
      const tone = toneDefine[key];
      if (!Array.isArray(tone)) {
        continue;
      }
      if (!isTagRelateTone(tone)) {
        continue;
      }
      toneList.push(key as TOUColorTone);
    }

    console.log(selectingTag.value, toneList);
    const baseColor = TOUHSBColor.numberToInstance(
      selectingColor.value.hue,
      1,
      0.5
    );

    const suggestHSBList = new Array<TOUHSBColor>();
    for (const tone of toneList) {
      const color = baseColor.getChangedTone(tone);
      for (let i = -2; i <= 2; i++) {
        suggestHSBList.push(color.getShiftHue((i * 2) / 3));
      }
    }
    // TOUColorに変換
    const suggestList = suggestHSBList.map(
      (color) => new TOUColor(color.getCode())
    );

    // 重複を削除して提案リストに追加
    suggestColorList.value = suggestList.filter(
      (color, index) =>
        suggestList.findIndex((c) => c.code === color.code) === index
    );
  };

  const onChangeSelectingTag = (event: Event, tag: ColorTagSelection) => {
    if (!event.target || !(event.target instanceof HTMLInputElement)) {
      return;
    }

    const checked = event.target.checked;
    if (checked) {
      if (selectingTag.value.includes(tag)) {
        return;
      }
      selectingTag.value.push(tag);
    } else {
      selectingTag.value = selectingTag.value.filter(
        (t) => t.value !== tag.value
      );
    }
  };

  return {
    colorTagSelections,
    colorOptions,
    selectingTag,
    selectingColor,
    suggestColorList,
    onSearchColor,
    onChangeSelectingTag,
    isSearching: isCalling
  };
};
