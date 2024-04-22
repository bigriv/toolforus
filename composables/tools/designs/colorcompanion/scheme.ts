import { TOUColor } from "@/types/common/color/color";
import { TOUColorTone } from "@/types/common/color/tone";

export const useColorScehme = (baseColor: Ref<TOUColor>) => {
  const schemeList = computed(() => {
    return {
      DOMINANT_COLOR: {
        label: "ドミナントカラー配色",
        description: "色相を統一し、トーンを変化させた配色",
        ...getDominantColor(baseColor.value),
      },
      DOMINANT_TONE: {
        label: "ドミナントトーン配色",
        description:
          "ベースカラーのトーンを元に、トーンを統一し、色相を変える配色",
        ...getDominantTone(baseColor.value),
      },
      TONE_ON_TONE: {
        label: "トーンオントーン配色",
        description: "同一色相で、トーン差が大きい色を組み合わせた配色",
        ...getToneOnTone(baseColor.value),
      },
      TONE_IN_TONE: {
        label: "トーンイントーン配色",
        description: "ベースカラーの色を元に、トーンを統一し、色相を変える配色",
        ...getToneInTone(baseColor.value),
      },
      // 基準色が限定される(中明度、中・低彩度の必要がある)ので除外
      // TONAL: {
      //   label: "トーナル配色",
      //   description: "中明度、中・低彩度の中間色領域のトーンによる配色",
      // },
      CAMAIEU: {
        label: "カマイユ配色",
        description: "色相、トーンを近づけて、ほとんど一色に見えるような配色",
        ...getCamaieu(baseColor.value),
      },
      FAUX_CAMAIEU: {
        label: "フォカマイユ配色",
        description: "類似色相・類似トーンの配色",
        ...getFauxCamaieu(baseColor.value),
      },
      BICOLOR: {
        label: "ビコロール配色",
        description: "コントラストの効いた、明快な2色配色",
        ...getBicolor(baseColor.value),
      },
      TRICOLOR: {
        label: "トリコロール配色",
        description: "コントラストの効いた、明快な3色配色",
        ...getTricolor(baseColor.value),
      },
    };
  });

  /**
   * ドミナントカラー配色のアクセントカラー、サブカラーを取得する
   * アクセントカラー: ベースカラーと同色相でトーン差が大きい色
   * サブカラー: ベースカラーと同色相でトーン差が少ない色
   * @param baseColor ベースカラー
   * @returns アクセントカラーとサブカラー
   */
  const getDominantColor = (
    baseColor: TOUColor
  ): { accent: TOUColor; sub: TOUColor } => {
    const baseTone = baseColor.hsb.getTone();
    if (!baseTone) {
      let accentSaturation = 0;
      let accentBrightness = 0;
      let subSaturation = 0;
      let subBrightness = 0;
      if (baseColor.hsb.saturation < 0.5) {
        accentSaturation = baseColor.hsb.saturation + 0.3;
        subSaturation = baseColor.hsb.saturation + 0.15;
      } else {
        accentSaturation = baseColor.hsb.saturation - 0.3;
        subSaturation = baseColor.hsb.saturation - 0.15;
      }

      if (baseColor.hsb.brightness < 0.5) {
        accentBrightness = baseColor.hsb.brightness + 0.3;
        subBrightness = baseColor.hsb.brightness + 0.15;
      } else {
        accentBrightness = baseColor.hsb.brightness - 0.3;
        subBrightness = baseColor.hsb.brightness - 0.15;
      }
      // トーン分類に入らない有彩色
      return {
        accent: TOUColor.hsbToInstance(
          baseColor.hsb.hue,
          accentSaturation,
          accentBrightness
        ),
        sub: TOUColor.hsbToInstance(
          baseColor.hsb.hue,
          subSaturation,
          subBrightness
        ),
      };
    }

    const CONVERT_DEFINE = {
      NON_COLORED_BRIGHT: {
        accent: TOUColorTone.NON_COLORED_DARK,
        sub: TOUColorTone.NON_COLORED_PALE,
      },
      NON_COLORED_PALE: {
        accent: TOUColorTone.NON_COLORED_DARK,
        sub: TOUColorTone.NON_COLORED_GRAISH,
      },
      NON_COLORED_GRAISH: {
        accent: TOUColorTone.BRIGHT,
        sub: TOUColorTone.DULL,
      },
      NON_COLORED_DULL: {
        accent: TOUColorTone.PALE,
        sub: TOUColorTone.DARK,
      },
      NON_COLORED_DARK: {
        accent: TOUColorTone.BRIGHT,
        sub: TOUColorTone.DULL,
      },
      VIVID: {
        accent: TOUColorTone.DARK,
        sub: TOUColorTone.BRIGHT,
      },
      BRIGHT: {
        accent: TOUColorTone.DARK,
        sub: TOUColorTone.STRONG,
      },
      STRONG: {
        accent: TOUColorTone.LIGHT,
        sub: TOUColorTone.DEEP,
      },
      DEEP: {
        accent: TOUColorTone.LIGHT,
        sub: TOUColorTone.STRONG,
      },
      LIGHT: {
        accent: TOUColorTone.DULL,
        sub: TOUColorTone.PALE,
      },
      SOFT: {
        accent: TOUColorTone.DEEP,
        sub: TOUColorTone.LIGHT,
      },
      DULL: {
        accent: TOUColorTone.BRIGHT,
        sub: TOUColorTone.DARK,
      },
      DARK: {
        accent: TOUColorTone.SOFT,
        sub: TOUColorTone.DARK_GRAYISH,
      },
      PALE: {
        accent: TOUColorTone.GRAYISH,
        sub: TOUColorTone.LIGHT,
      },
      LIGHT_GRAYISH: {
        accent: TOUColorTone.SOFT,
        sub: TOUColorTone.DARK_GRAYISH,
      },
      GRAYISH: {
        accent: TOUColorTone.LIGHT,
        sub: TOUColorTone.DARK_GRAYISH,
      },
      DARK_GRAYISH: {
        accent: TOUColorTone.LIGHT_GRAYISH,
        sub: TOUColorTone.DARK,
      },
      VERY_PALE: {
        accent: TOUColorTone.MIDDLE_GRAYISH,
        sub: TOUColorTone.PALE,
      },
      PALE_GRAYISH: {
        accent: TOUColorTone.GRAYISH,
        sub: TOUColorTone.VERY_PALE,
      },
      MIDDLE_GRAYISH: {
        accent: TOUColorTone.DARK_GRAYISH,
        sub: TOUColorTone.PALE_GRAYISH,
      },
      VERY_GRAYISH: {
        accent: TOUColorTone.VERY_DARK,
        sub: TOUColorTone.LIGHT_GRAYISH,
      },
      VERY_DARK: {
        accent: TOUColorTone.MIDDLE_GRAYISH,
        sub: TOUColorTone.DARK_GRAYISH,
      },
    };

    return {
      accent: new TOUColor(
        baseColor.hsb.getChangedTone(CONVERT_DEFINE[baseTone].accent).getCode()
      ),
      sub: new TOUColor(
        baseColor.hsb.getChangedTone(CONVERT_DEFINE[baseTone].sub).getCode()
      ),
    };
  };

  /**
   * ドミナントトーン配色のアクセントカラー、サブカラーを取得する
   * アクセントカラー: ベースカラーと同じトーンの補色
   * サブカラー: ベースカラーと同じトーンの類似色
   * @param baseColor ベースカラー
   * @returns アクセントカラーとサブカラー
   */
  const getDominantTone = (
    baseColor: TOUColor
  ): { accent: TOUColor; sub: TOUColor } => {
    return {
      accent: baseColor.getComplementary(),
      sub: baseColor.getSimilarColors()[0],
    };
  };
  const getToneOnTone = (
    baseColor: TOUColor
  ): { accent: TOUColor; sub: TOUColor } => {
    const baseTone = baseColor.hsb.getTone();

    const CONVERT_DEFINE: {
      [key: string]: { accent: TOUColorTone; sub: TOUColorTone };
    } = {
      // NON_COLORED_BRIGHT: {},
      // NON_COLORED_PALE: {},
      // NON_COLORED_GRAISH: {},
      // NON_COLORED_DULL: {},
      // NON_COLORED_DARK: {},
      // VIVID: {},
      BRIGHT: {
        accent: TOUColorTone.DEEP,
        sub: TOUColorTone.STRONG,
      },
      STRONG: {
        accent: TOUColorTone.BRIGHT,
        sub: TOUColorTone.DEEP,
      },
      DEEP: {
        accent: TOUColorTone.BRIGHT,
        sub: TOUColorTone.STRONG,
      },
      LIGHT: {
        accent: TOUColorTone.DULL,
        sub: TOUColorTone.SOFT,
      },
      SOFT: {
        accent: TOUColorTone.DARK,
        sub: TOUColorTone.DULL,
      },
      DULL: {
        accent: TOUColorTone.LIGHT,
        sub: TOUColorTone.SOFT,
      },
      DARK: {
        accent: TOUColorTone.SOFT,
        sub: TOUColorTone.DULL,
      },
      PALE: {
        accent: TOUColorTone.GRAYISH,
        sub: TOUColorTone.LIGHT_GRAYISH,
      },
      LIGHT_GRAYISH: {
        accent: TOUColorTone.DARK_GRAYISH,
        sub: TOUColorTone.GRAYISH,
      },
      GRAYISH: {
        accent: TOUColorTone.PALE,
        sub: TOUColorTone.LIGHT_GRAYISH,
      },
      DARK_GRAYISH: {
        accent: TOUColorTone.LIGHT_GRAYISH,
        sub: TOUColorTone.GRAYISH,
      },
      VERY_PALE: {
        accent: TOUColorTone.MIDDLE_GRAYISH,
        sub: TOUColorTone.PALE_GRAYISH,
      },
      PALE_GRAYISH: {
        accent: TOUColorTone.VERY_GRAYISH,
        sub: TOUColorTone.MIDDLE_GRAYISH,
      },
      MIDDLE_GRAYISH: {
        accent: TOUColorTone.VERY_DARK,
        sub: TOUColorTone.VERY_GRAYISH,
      },
      VERY_GRAYISH: {
        accent: TOUColorTone.PALE_GRAYISH,
        sub: TOUColorTone.MIDDLE_GRAYISH,
      },
      VERY_DARK: {
        accent: TOUColorTone.MIDDLE_GRAYISH,
        sub: TOUColorTone.VERY_GRAYISH,
      },
    };

    if (!baseTone || !CONVERT_DEFINE[baseTone]) {
      let accentBrightness = 0;
      let subBrightness = 0;
      if (baseColor.hsb.brightness < 0.5) {
        accentBrightness = baseColor.hsb.brightness + 0.3;
        subBrightness = baseColor.hsb.brightness + 0.15;
      } else {
        accentBrightness = baseColor.hsb.brightness - 0.3;
        subBrightness = baseColor.hsb.brightness - 0.15;
      }
      return {
        accent: TOUColor.hsbToInstance(
          baseColor.hsb.hue,
          baseColor.hsb.saturation,
          accentBrightness
        ),
        sub: TOUColor.hsbToInstance(
          baseColor.hsb.hue,
          baseColor.hsb.saturation,
          subBrightness
        ),
      };
    }

    return {
      accent: new TOUColor(
        baseColor.hsb.getChangedTone(CONVERT_DEFINE[baseTone].accent).getCode()
      ),
      sub: new TOUColor(
        baseColor.hsb.getChangedTone(CONVERT_DEFINE[baseTone].sub).getCode()
      ),
    };
  };

  /**
   * トーンイントーン配色のアクセントカラー、サブカラーを取得する
   * アクセントカラー: ベースカラーの反対色
   * サブカラー: ベースカラーの反対色
   * @param baseColor ベースカラー
   * @returns アクセントカラーとサブカラー
   */
  const getToneInTone = (
    baseColor: TOUColor
  ): { accent: TOUColor; sub: TOUColor } => {
    const oppositeColors = baseColor.getOppositeColors();
    return { accent: oppositeColors[0], sub: oppositeColors[1] };
  };

  /**
   * カマイユ配色のアクセントカラー、サブカラーを取得する
   * アクセントカラー: ベースカラーの隣接色
   * サブカラー: ベースカラーと同色相でトーンが隣接している色
   * @param baseColor ベースカラー
   * @returns アクセントカラーとサブカラー
   */
  const getCamaieu = (
    baseColor: TOUColor
  ): { accent: TOUColor; sub: TOUColor } => {
    const neighboringColor = baseColor.getNeighboringColors()[0];
    const CONVERT_DEFINE: {
      [key: string]: TOUColorTone;
    } = {
      NON_COLORED_BRIGHT: TOUColorTone.PALE,
      NON_COLORED_PALE: TOUColorTone.GRAYISH,
      NON_COLORED_GRAISH: TOUColorTone.DULL,
      NON_COLORED_DULL: TOUColorTone.GRAYISH,
      NON_COLORED_DARK: TOUColorTone.DULL,
      VIVID: TOUColorTone.STRONG,
      BRIGHT: TOUColorTone.STRONG,
      STRONG: TOUColorTone.VIVID,
      DEEP: TOUColorTone.STRONG,
      LIGHT: TOUColorTone.SOFT,
      SOFT: TOUColorTone.DULL,
      DULL: TOUColorTone.DARK,
      DARK: TOUColorTone.DULL,
      PALE: TOUColorTone.LIGHT_GRAYISH,
      LIGHT_GRAYISH: TOUColorTone.GRAYISH,
      GRAYISH: TOUColorTone.DARK_GRAYISH,
      DARK_GRAYISH: TOUColorTone.GRAYISH,
      VERY_PALE: TOUColorTone.PALE_GRAYISH,
      PALE_GRAYISH: TOUColorTone.MIDDLE_GRAYISH,
      MIDDLE_GRAYISH: TOUColorTone.VERY_GRAYISH,
      VERY_GRAYISH: TOUColorTone.VERY_DARK,
      VERY_DARK: TOUColorTone.VERY_GRAYISH,
    };

    const baseTone = baseColor.hsb.getTone();
    if (!baseTone || !CONVERT_DEFINE[baseTone]) {
      let saturation = 0;
      let brightness = 0;
      if (baseColor.hsb.saturation < 0.5) {
        saturation = baseColor.hsb.saturation + 0.15;
      } else {
        saturation = baseColor.hsb.saturation - 0.15;
      }

      if (baseColor.hsb.brightness < 0.5) {
        brightness = baseColor.hsb.brightness + 0.15;
      } else {
        brightness = baseColor.hsb.brightness - 0.15;
      }

      return {
        accent: neighboringColor,
        sub: TOUColor.hsbToInstance(baseColor.hsb.hue, saturation, brightness),
      };
    }

    return {
      accent: neighboringColor,
      sub: new TOUColor(
        baseColor.hsb.getChangedTone(CONVERT_DEFINE[baseTone]).getCode()
      ),
    };
  };

  /**
   * フォカマイユ配色のアクセントカラー、サブカラーを取得する
   * アクセントカラー: ベースカラーの類似色
   * サブカラー: ベースカラーと同色相でトーンが隣接している色
   * @param baseColor ベースカラー
   * @returns アクセントカラーとサブカラー
   */
  const getFauxCamaieu = (
    baseColor: TOUColor
  ): { accent: TOUColor; sub: TOUColor } => {
    const similarColor = baseColor.getSimilarColors()[0];
    const CONVERT_DEFINE: {
      [key: string]: TOUColorTone;
    } = {
      NON_COLORED_BRIGHT: TOUColorTone.PALE,
      NON_COLORED_PALE: TOUColorTone.GRAYISH,
      NON_COLORED_GRAISH: TOUColorTone.DULL,
      NON_COLORED_DULL: TOUColorTone.GRAYISH,
      NON_COLORED_DARK: TOUColorTone.DULL,
      VIVID: TOUColorTone.STRONG,
      BRIGHT: TOUColorTone.STRONG,
      STRONG: TOUColorTone.VIVID,
      DEEP: TOUColorTone.STRONG,
      LIGHT: TOUColorTone.SOFT,
      SOFT: TOUColorTone.DULL,
      DULL: TOUColorTone.DARK,
      DARK: TOUColorTone.DULL,
      PALE: TOUColorTone.LIGHT_GRAYISH,
      LIGHT_GRAYISH: TOUColorTone.GRAYISH,
      GRAYISH: TOUColorTone.DARK_GRAYISH,
      DARK_GRAYISH: TOUColorTone.GRAYISH,
      VERY_PALE: TOUColorTone.PALE_GRAYISH,
      PALE_GRAYISH: TOUColorTone.MIDDLE_GRAYISH,
      MIDDLE_GRAYISH: TOUColorTone.VERY_GRAYISH,
      VERY_GRAYISH: TOUColorTone.VERY_DARK,
      VERY_DARK: TOUColorTone.VERY_GRAYISH,
    };

    const baseTone = baseColor.hsb.getTone();
    if (!baseTone || !CONVERT_DEFINE[baseTone]) {
      let saturation = 0;
      let brightness = 0;
      if (baseColor.hsb.saturation < 0.5) {
        saturation = baseColor.hsb.saturation + 0.15;
      } else {
        saturation = baseColor.hsb.saturation - 0.15;
      }

      if (baseColor.hsb.brightness < 0.5) {
        brightness = baseColor.hsb.brightness + 0.15;
      } else {
        brightness = baseColor.hsb.brightness - 0.15;
      }

      return {
        accent: similarColor,
        sub: TOUColor.hsbToInstance(baseColor.hsb.hue, saturation, brightness),
      };
    }

    return {
      accent: similarColor,
      sub: new TOUColor(
        baseColor.hsb.getChangedTone(CONVERT_DEFINE[baseTone]).getCode()
      ),
    };
  };

  /**
   * ビコロール配色のアクセントカラー、サブカラーを取得する
   * アクセントカラー: 白または黒
   * サブカラー: ベースカラーと同じ色
   * @param baseColor ベースカラー
   * @returns アクセントカラーとサブカラー
   */
  const getBicolor = (
    baseColor: TOUColor
  ): { accent: TOUColor; sub: TOUColor } => {
    let accentColor = new TOUColor(TOUColor.CODE_WHITE);
    if (baseColor.hsb.brightness >= 0.5) {
      accentColor = new TOUColor(TOUColor.CODE_BLACK);
    }

    return { accent: accentColor, sub: baseColor };
  };

  /**
   * トリコロール配色のアクセントカラー、サブカラーを取得する
   * アクセントカラー: 白または黒
   * サブカラー: ベースカラーの反対色
   * @param baseColor ベースカラー
   * @returns アクセントカラーとサブカラー
   */
  const getTricolor = (
    baseColor: TOUColor
  ): { accent: TOUColor; sub: TOUColor } => {
    let accentColor = new TOUColor(TOUColor.CODE_WHITE);
    if (baseColor.hsb.brightness >= 0.5) {
      accentColor = new TOUColor(TOUColor.CODE_BLACK);
    }

    return { accent: accentColor, sub: baseColor.getOppositeColors()[0] };
  };

  return {
    schemeList,
  };
};
