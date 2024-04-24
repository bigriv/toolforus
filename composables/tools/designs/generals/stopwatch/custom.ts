import { TOUColor } from "@/types/common/color/color";
import { TOUFont } from "@/types/common/css/font";

export const useStopwatchCustom = (args: {
  bgColor: TOUColor;
  font: TOUFont;
  position: "left" | "center" | "right";
}) => {
  const fontFamilyList = [
    { value: "Arial", label: "Arial" },
    { value: "Helvetica", label: "Helvetica" },
    { value: "Helvetica Neue", label: "Helvetica Neue" },
    { value: "Segoe UI", label: "Segoe UI" },
    { value: "San Francisco", label: "San Francisco" },
    { value: "ＭＳ ゴシック", label: "ＭＳ ゴシック" },
    { value: "MS Pゴシック", label: "MS Pゴシック" },
    { value: "メイリオ", label: "メイリオ" },
    { value: "ヒラギノ角ゴシック", label: "ヒラギノ角ゴシック" },
    { value: "ヒラギノ丸ゴシック ProN", label: "ヒラギノ丸ゴシック ProN" },
    { value: "Osaka", label: "Osaka" },
    { value: "游明朝", label: "游明朝" },
    { value: "ヒラギノ明朝 ProN W3", label: "ヒラギノ明朝 ProN W3" },
    { value: "MS 明朝", label: "MS 明朝" },
  ];
  const fontWeightList = [
    {
      value: "lighter",
      label: "細字",
    },
    {
      value: "normal",
      label: "中字",
    },
    {
      value: "bolder",
      label: "太字",
    },
  ];
  const positionList = [
    {
      value: "left",
      label: "左",
    },
    {
      value: "center",
      label: "中",
    },
    {
      value: "right",
      label: "右",
    },
  ];

  const url = ref("");
  const form = reactive({
    bgColor: args.bgColor,
    font: args.font,
    position: args.position,
  });
  const onCreateURL = () => {
    const temps: { [key: string]: string | number | undefined } = {};
    temps.bgColor = form.bgColor.code ?? "";
    temps.bgOpacity = form.bgColor.alpha ?? "";
    temps.fontColor = form.font.color.code ?? "";
    temps.fontOpacity = form.font.color.alpha ?? "";
    temps.fontSize = form.font.size ?? "";
    temps.fontWeight = form.font.weight ?? "";
    temps.fontFamily = form.font.family ?? "";
    temps.position = form.position ?? "";

    let params: Array<string> = [];
    for (const key of Object.keys(temps)) {
      let value: string | number | undefined = temps[key];
      if (!value) {
        value = "";
      } else if (typeof value === "number") {
        value = String(value);
      }
      params.push(`${key}=${value}`);
    }
    url.value = encodeURI(
      useRuntimeConfig().public.host +
        "/tools/generals/stopwatch?" +
        params.join("&")
    ).replace(/#/g, "%23");
  };
  const onCopyURL = () => {
    navigator.clipboard.writeText(url.value);
  };

  return {
    fontFamilyList,
    fontWeightList,
    positionList,
    url,
    form,
    onCreateURL,
    onCopyURL,
  };
};
