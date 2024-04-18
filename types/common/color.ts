export enum TOUColorTone {
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

export class TOUColor {
  static readonly CODE_BLACK = "#000000";
  static readonly CODE_WHITE = "#ffffff";
  static readonly CODE_LIGHT_GRAY = "#d3d3d3";
  static readonly CODE_FORMAT = /^#[0-9a-fA-F]{6}$/;

  rgb: TOURGBColor;
  hsb: TOUHSBColor;
  code: string;
  alpha: number;

  constructor(code: string, alpha?: number) {
    this.code = code;
    this.rgb = new TOURGBColor(code);
    this.hsb = new TOUHSBColor(code);
    this.alpha = alpha ?? 1;
  }

  /**
   * カラーコードを更新する
   * @param code カラーコード
   */
  setColor(code: string) {
    if (!TOUColor.CODE_FORMAT.test(code)) {
      // カラーコードがフォーマットに適してない場合は何もしない
      return;
    }
    this.code = code;
    this.rgb.setColor(code);
    this.hsb.setColor(code);
  }

  /**
   * 透明度を更新する
   * @param alpha 透明度(0~1)
   */
  setAlpha(alpha: number) {
    if (alpha < 0) {
      this.alpha = 0;
    } else if (alpha > 1) {
      this.alpha = 1;
    } else {
      this.alpha = alpha;
    }
  }

  /**
   * 補色の取得
   * RGB値の最小値と最大値の和を取得し、その値からRGBの各値を減算することで新しいRGB値を算出する。
   * @returns 補色
   */
  getComplementary(): TOUColor {
    const max = Math.max(this.rgb.red, this.rgb.green, this.rgb.blue);
    const min = Math.min(this.rgb.red, this.rgb.green, this.rgb.blue);
    const standard = max + min;
    return new TOUColor(
      TOURGBColor.numberToCode(
        standard - this.rgb.red,
        standard - this.rgb.green,
        standard - this.rgb.blue
      ),
      this.alpha
    );
  }

  /**
   * 反転色を取得する
   * 255からRGBの各値を減算することで新しいRGB値を算出する。
   * @returns 反転色
   */
  getInverted(): TOUColor {
    const red = 255 - this.rgb.red;
    const green = 255 - this.rgb.green;
    const blue = 255 - this.rgb.blue;

    return new TOUColor(TOURGBColor.numberToCode(red, blue, green), this.alpha);
  }

  /**
   * 反対色を取得する
   * RGB値からHSV値に変換⇒H値に±8した値を取得⇒RGB値に戻す
   * @returns 反対色のリスト
   */
  getOppositeColors(): TOUColor[] {
    const hsb = this.hsb;
    const shiftedMinus = hsb.getShiftHue(-8);
    const shiftedPlus = hsb.getShiftHue(8);

    return [
      new TOUColor(shiftedMinus.getCode(), this.alpha),
      new TOUColor(shiftedPlus.getCode(), this.alpha),
    ];
  }

  /**
   * 類似色を取得する
   * RGB値からHSV値に変換⇒H値に±2した値を取得⇒RGB値に戻す
   * @returns 類似色のリスト
   */
  getSimilarColor(): TOUColor[] {
    const hsb = this.hsb;
    const shiftedMinus = hsb.getShiftHue(-2);
    const shiftedPlus = hsb.getShiftHue(2);

    return [
      new TOUColor(shiftedMinus.getCode(), this.alpha),
      new TOUColor(shiftedPlus.getCode(), this.alpha),
    ];
  }

  /**
   * rgba値を取得する
   * @returns rgba(red, green, blue, opacity)
   */
  getRGBA(): string {
    const red = this.rgb.red;
    const green = this.rgb.green;
    const blue = this.rgb.blue;
    return `rgba(${red}, ${green}, ${blue}, ${this.alpha})`;
  }

  static rgbaToInstance(rgba: string): TOUColor | undefined {
    const values = rgba.match(
      /^rgba\((\d{1,3}), (\d{1,3}), (\d{1,3}), ([0-9.]+)\)$/
    );
    if (!values) {
      return undefined;
    }
    const r = values[1];
    const g = values[2];
    const b = values[3];
    const opacity = values[4];
    if (!r || !g || !b || !opacity) {
      return undefined;
    }
    return new TOUColor(
      TOURGBColor.numberToCode(Number(r), Number(g), Number(b)),
      Number(opacity)
    );
  }
}

export class TOURGBColor {
  red: number = 255;
  green: number = 255;
  blue: number = 255;

  constructor(code: string) {
    this.setColor(code);
  }

  /**
   * カラーコードから値を更新する
   * @param code カラーコード
   * @returns
   */
  setColor(code: string) {
    if (!TOUColor.CODE_FORMAT.test(code)) {
      // カラーコードがフォーマットに適してない場合は何もしない
      return;
    }
    const red = Number("0x" + code.slice(1, 3));
    const green = Number("0x" + code.slice(3, 5));
    const blue = Number("0x" + code.slice(5, 7));
    if (Number.isNaN(red) || Number.isNaN(green) || Number.isNaN(blue)) {
      // 16進数への変換が非数になった場合は何もしない
      return;
    }

    this.setRed(red);
    this.setGreen(green);
    this.setBlue(blue);
  }

  /**
   * 赤成分の値を更新する
   * @param red 赤成分の値(0~255)
   */
  setRed(red: number): void {
    if (red > 255) {
      this.red = 255;
    } else if (red < 0) {
      this.red = 0;
    } else {
      this.red = red;
    }
  }

  /**
   * 緑成分の値を更新する
   * @param green 緑成分の値(0~255)
   */
  setGreen(green: number): void {
    if (green > 255) {
      this.green = 255;
    } else if (green < 0) {
      this.green = 0;
    } else {
      this.green = green;
    }
  }

  /**
   * 青成分の値を更新する
   * @param blue 青成分の値(0~255)
   */
  setBlue(blue: number): void {
    if (blue > 255) {
      this.blue = 255;
    } else if (blue < 0) {
      this.blue = 0;
    } else {
      this.blue = blue;
    }
  }

  /**
   * カラーコードを取得する
   * @returns #ffffff形式のカラーコード
   */
  getCode(): string {
    const convertToHex = (value: number) => {
      let color = value;
      if (value < 0) {
        color = 0;
      } else if (value > 255) {
        color = 255;
      }
      return color.toString(16).padStart(2, "0");
    };
    const r = convertToHex(this.red);
    const g = convertToHex(this.green);
    const b = convertToHex(this.blue);
    return `#${r}${g}${b}`;
  }

  /**
   * rgb値を取得する
   * @returns rgb(red, gree, blue)形式の文字列
   */
  getRGB(): string {
    const red = this.red;
    const green = this.green;
    const blue = this.blue;
    return `rgb(${red}, ${green}, ${blue})`;
  }

  /**
   * RGB値からインスタンスを生成する
   * @param red 赤成分の値
   * @param green 緑成分の値
   * @param blue 青成分の値
   * @returns RGB値のインスタンス
   */
  static numberToInstance(
    red: number,
    green: number,
    blue: number
  ): TOURGBColor {
    const color = new TOURGBColor(TOUColor.CODE_WHITE);
    color.setRed(red);
    color.setGreen(green);
    color.setBlue(blue);

    return color;
  }

  /**
   * RGB値からカラーコードに変換する
   * @param red 赤成分の値
   * @param green 緑成分の値
   * @param blue 青成分の値
   * @returns カラーコード
   */
  static numberToCode(red: number, green: number, blue: number): string {
    return TOURGBColor.numberToInstance(red, green, blue).getCode();
  }
}

export class TOUHSBColor {
  hue: number = 0;
  saturation: number = 1;
  brightness: number = 0.5;

  constructor(code: string) {
    this.setColor(code);
  }

  /**
   * カラーコードから値を更新する
   * @param code カラーコード
   * @returns
   */
  setColor(code: string) {
    if (!TOUColor.CODE_FORMAT.test(code)) {
      // カラーコードがフォーマットに適してない場合は何もしない
      return;
    }
    const red = Number("0x" + code.slice(1, 3));
    const green = Number("0x" + code.slice(3, 5));
    const blue = Number("0x" + code.slice(5, 7));
    if (Number.isNaN(red) || Number.isNaN(green) || Number.isNaN(blue)) {
      // 16進数への変換が非数になった場合は何もしない
      return;
    }

    const max = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);
    const delta = max - min;
    let hue = 0;
    if (delta === 0) {
      hue = 0;
    } else if (max === red) {
      hue = (60 * (green - blue)) / delta;
    } else if (max === green) {
      hue = (60 * (blue - red)) / delta + 120;
    } else if (max === blue) {
      hue = (60 * (red - green)) / delta + 240;
    }

    if (hue < 0) {
      hue += 360;
    }

    const saturation = max === 0 ? 0 : delta / max;
    const brightness = max / 255;

    this.setHue(hue);
    this.setSaturation(saturation);
    this.setBrightness(brightness);
  }

  /**
   * 色相の値を更新する
   * @param hue 色相の値(0~359)
   */
  setHue(hue: number) {
    const h = Math.round(((hue / 360.0) % 1.0) * 360);
    this.hue = h < 0 ? h + 360 : h;
  }

  /**
   * 彩度の値を更新する
   * @param saturation 彩度(0~1)
   */
  setSaturation(saturation: number) {
    if (saturation < 0) {
      this.saturation = 0;
    } else if (saturation > 1) {
      this.saturation = 1;
    } else {
      this.saturation = saturation;
    }
  }

  /**
   * 明度の値を更新する
   * @param brightness 明度(0~1)
   */
  setBrightness(brightness: number) {
    if (brightness < 0) {
      this.brightness = 0;
    } else if (brightness > 1) {
      this.brightness = 1;
    } else {
      this.brightness = brightness;
    }
  }

  /**
   * 色相をずらした場合の色を取得する
   * @param shift ずらす相の数
   * @returns 色相をずらした色
   */
  getShiftHue(shift: number): TOUHSBColor {
    const shiftedColor = new TOUHSBColor(this.getCode());
    shiftedColor.setHue(
      Math.round((((this.hue + shift * 15) / 360.0) % 1.0) * 360)
    );
    return shiftedColor;
  }

  /**
   * トーンを変更した色を取得する
   * @param tone 変更後のトーンの種類
   * @returns トーン変更後の色
   */
  getChangedTone(tone: TOUColorTone): TOUHSBColor {
    const changedColor = new TOUHSBColor(this.getCode());
    let newSaturation = undefined;
    let newBrightness = undefined;
    switch (tone) {
      case TOUColorTone.VIVID:
        newSaturation = 100;
        newBrightness = 100;
        break;
      case TOUColorTone.BRIGHT:
        newSaturation = 80;
        newBrightness = 100;
        break;
      case TOUColorTone.STRONG:
        newSaturation = 70;
        newBrightness = 80;
        break;
      case TOUColorTone.DEEP:
        newSaturation = 60;
        newBrightness = 70;
        break;
      case TOUColorTone.LIGHT:
        newSaturation = 60;
        newBrightness = 100;
        break;
      case TOUColorTone.SOFT:
        newSaturation = 50;
        newBrightness = 80;
        break;
      case TOUColorTone.DULL:
        newSaturation = 40;
        newBrightness = 60;
        break;
      case TOUColorTone.DARK:
        newSaturation = 40;
        newBrightness = 50;
        break;
      case TOUColorTone.PALE:
        newSaturation = 30;
        newBrightness = 100;
        break;
      case TOUColorTone.LIGHT_GRAYISH:
        newSaturation = 30;
        newBrightness = 80;
        break;
      case TOUColorTone.GRAYISH:
        newSaturation = 30;
        newBrightness = 70;
        break;
      case TOUColorTone.DARK_GRAYISH:
        newSaturation = 30;
        newBrightness = 60;
        break;
      case TOUColorTone.VERY_PALE:
        newSaturation = 10;
        newBrightness = 100;
        break;
      case TOUColorTone.PALE_GRAYISH:
        newSaturation = 10;
        newBrightness = 80;
        break;
      case TOUColorTone.MIDDLE_GRAYISH:
        newSaturation = 10;
        newBrightness = 70;
        break;
      case TOUColorTone.VERY_GRAYISH:
        newSaturation = 10;
        newBrightness = 60;
        break;
      case TOUColorTone.VERY_DARK:
        newSaturation = 10;
        newBrightness = 50;
        break;
    }

    if (newSaturation === undefined || newBrightness === undefined) {
      return changedColor;
    }

    changedColor.setSaturation(newSaturation / 100);
    changedColor.setBrightness(newBrightness / 100);
    return changedColor;
  }

  /**
   * カラーコードを取得する
   * @returns カラーコード
   */
  getCode(): string {
    const c = this.brightness * this.saturation;
    const x = c * (1 - Math.abs(((this.hue / 60) % 2) - 1));
    const m = this.brightness - c;

    let rgbPrime;
    if (this.hue < 60) {
      rgbPrime = [c, x, 0];
    } else if (this.hue < 120) {
      rgbPrime = [x, c, 0];
    } else if (this.hue < 180) {
      rgbPrime = [0, c, x];
    } else if (this.hue < 240) {
      rgbPrime = [0, x, c];
    } else if (this.hue < 300) {
      rgbPrime = [x, 0, c];
    } else {
      rgbPrime = [c, 0, x];
    }

    const r = Math.round((rgbPrime[0] + m) * 255);
    const g = Math.round((rgbPrime[1] + m) * 255);
    const b = Math.round((rgbPrime[2] + m) * 255);

    return TOURGBColor.numberToCode(r, g, b);
  }

  /**
   * HSV値からインスタンスを生成する
   * @param hue 色相の成分値
   * @param saturation 彩度の成分値
   * @param brightness 明度の成分値
   * @returns HSV値のインスタンス
   */
  static numberToInstance(
    hue: number,
    saturation: number,
    brightness: number
  ): TOUHSBColor {
    const color = new TOUHSBColor(TOUColor.CODE_WHITE);
    color.setHue(hue);
    color.setSaturation(saturation);
    color.setBrightness(brightness);

    return color;
  }

  /**
   * HSVからカラーコードを取得する
   * @param hue 色相の成分値
   * @param saturation 彩度の成分値
   * @param brightness 明度の成分値
   * @returns カラーコード
   */
  static numberToCode(hue: number, saturation: number, brightness: number) {
    return TOUHSBColor.numberToInstance(hue, saturation, brightness).getCode();
  }
}
