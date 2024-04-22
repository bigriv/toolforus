export enum TOUColorTone {
  NON_COLORED_BRIGHT = "NON_COLORED_BRIGHT", // 無彩色(白)
  NON_COLORED_PALE = "NON_COLORED_PALE", // 無彩色(明るい灰)
  NON_COLORED_GRAISH = "NON_COLORED_GRAISH", // 無彩色(灰)
  NON_COLORED_DULL = "NON_COLORED_DULL", // 無彩色(暗い灰)
  NON_COLORED_DARK = "NON_COLORED_DARK", // 無彩色(黒)
  VIVID = "VIVID", // ビビットトーン
  BRIGHT = "BRIGHT", // ブライトトーン
  STRONG = "STRONG", // ストロングトーン
  DEEP = "DEEP", // ディープトーン
  LIGHT = "LIGHT", // ライトトーン
  SOFT = "SOFT", // ソフトトーン
  DULL = "DULL", // ダルトーン
  DARK = "DARK", // ダークトーン
  PALE = "PALE", // ペールトーン
  LIGHT_GRAYISH = "LIGHT_GRAYISH", // ライトグレイッシュ
  GRAYISH = "GRAYISH", // グレイッシュトーン
  DARK_GRAYISH = "DARK_GRAYISH", // ダークグレイッシュトーン
  VERY_PALE = "VERY_PALE", // ベリーペールトーン
  PALE_GRAYISH = "PALE_GRAYISH", // ペールグレイッシュトーン
  MIDDLE_GRAYISH = "MIDDLE_GRAYISH", // ミドルグレイッシュトーン
  VERY_GRAYISH = "VERY_GRAYISH", // ベリーグレイッシュ
  VERY_DARK = "VERY_DARK", // ベリーダーク
}

export const TOU_TONE_DEFINE: {
  [key: string]: {
    base: {
      saturation: number;
      brightness: number;
    };
    min: {
      saturation: number;
      brightness: number;
    };
  };
} = {
  NON_COLORED_BRIGHT: {
    base: {
      saturation: 3,
      brightness: 100,
    },
    min: {
      saturation: 0,
      brightness: 80,
    },
  },
  NON_COLORED_PALE: {
    base: {
      saturation: 3,
      brightness: 80,
    },
    min: {
      saturation: 0,
      brightness: 60,
    },
  },
  NON_COLORED_GRAISH: {
    base: {
      saturation: 3,
      brightness: 60,
    },
    min: {
      saturation: 0,
      brightness: 40,
    },
  },
  NON_COLORED_DULL: {
    base: {
      saturation: 3,
      brightness: 40,
    },
    min: {
      saturation: 0,
      brightness: 20,
    },
  },
  NON_COLORED_DARK: {
    base: {
      saturation: 3,
      brightness: 20,
    },
    min: {
      saturation: 3,
      brightness: 0,
    },
  },
  VIVID: {
    base: {
      saturation: 100,
      brightness: 100,
    },
    min: {
      saturation: 80,
      brightness: 50,
    },
  },
  BRIGHT: {
    base: {
      saturation: 75,
      brightness: 100,
    },
    min: {
      saturation: 60,
      brightness: 70,
    },
  },
  STRONG: {
    base: {
      saturation: 75,
      brightness: 80,
    },
    min: {
      saturation: 50,
      brightness: 60,
    },
  },
  DEEP: {
    base: {
      saturation: 75,
      brightness: 60,
    },
    min: {
      saturation: 40,
      brightness: 40,
    },
  },
  LIGHT: {
    base: {
      saturation: 50,
      brightness: 100,
    },
    min: {
      saturation: 40,
      brightness: 70,
    },
  },
  SOFT: {
    base: {
      saturation: 50,
      brightness: 80,
    },
    min: {
      saturation: 30,
      brightness: 50,
    },
  },
  DULL: {
    base: {
      saturation: 50,
      brightness: 60,
    },
    min: {
      saturation: 20,
      brightness: 30,
    },
  },
  DARK: {
    base: {
      saturation: 50,
      brightness: 40,
    },
    min: {
      saturation: 20,
      brightness: 20,
    },
  },
  PALE: {
    base: {
      saturation: 30,
      brightness: 100,
    },
    min: {
      saturation: 10,
      brightness: 70,
    },
  },
  LIGHT_GRAYISH: {
    base: {
      saturation: 30,
      brightness: 80,
    },
    min: {
      saturation: 10,
      brightness: 50,
    },
  },
  GRAYISH: {
    base: {
      saturation: 30,
      brightness: 60,
    },
    min: {
      saturation: 10,
      brightness: 30,
    },
  },
  DARK_GRAYISH: {
    base: {
      saturation: 30,
      brightness: 40,
    },
    min: {
      saturation: 10,
      brightness: 20,
    },
  },
  VERY_PALE: {
    base: {
      saturation: 10,
      brightness: 100,
    },
    min: {
      saturation: 3,
      brightness: 70,
    },
  },
  PALE_GRAYISH: {
    base: {
      saturation: 10,
      brightness: 80,
    },
    min: {
      saturation: 3,
      brightness: 50,
    },
  },
  MIDDLE_GRAYISH: {
    base: {
      saturation: 10,
      brightness: 60,
    },
    min: {
      saturation: 3,
      brightness: 40,
    },
  },
  VERY_GRAYISH: {
    base: {
      saturation: 10,
      brightness: 40,
    },
    min: {
      saturation: 3,
      brightness: 30,
    },
  },
  VERY_DARK: {
    base: {
      saturation: 10,
      brightness: 30,
    },
    min: {
      saturation: 3,
      brightness: 1,
    },
  },
} as const;
