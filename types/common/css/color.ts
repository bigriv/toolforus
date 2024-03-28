export class TOURGBColor {
  static readonly CODE_BLACK = "#000000";
  static readonly CODE_WHITE = "#ffffff";
  static readonly CODE_FORMAT = /^#[0-9a-fA-F]{6}$/;

  code: string;
  opacity: number;

  constructor(code?: string, opacity?: number) {
    this.code = TOURGBColor.CODE_WHITE;
    if (code) {
      this.setCode(code);
    }

    this.opacity = !code ? 0 : 1;
    if (opacity || opacity === 0) {
      this.setOpacity(opacity);
    }
  }

  /**
   * rgba値を取得する
   * @returns rgba(red, green, blue, opacity)
   */
  rgba(): string {
    const red = this.getRed();
    const green = this.getGreen();
    const blue = this.getBlue();
    return `rgba(${red}, ${green}, ${blue}, ${this.opacity})`;
  }

  hsba(): TOUHSBColor {
    const r = this.getRed();
    const g = this.getGreen();
    const b = this.getBlue();

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    let hue = 0;
    if (delta === 0) {
      hue = 0;
    } else if (max === r) {
      hue = (60 * (g - b)) / delta;
    } else if (max === g) {
      hue = (60 * (b - r)) / delta + 120;
    } else if (max === b) {
      hue = (60 * (r - g)) / delta + 240;
    }

    if (hue < 0) {
      hue += 360;
    }

    const saturation = max === 0 ? 0 : delta / max;
    const brightness = max / 255;

    return new TOUHSBColor(
      Math.round(hue * 100) / 100,
      Math.round(saturation * 10000) / 10000,
      Math.round(brightness * 10000) / 10000,
      this.opacity
    );
  }
  /**
   * 赤成分の値を取得する
   * @returns 赤成分の値
   */
  getRed(): number {
    if (!TOURGBColor.CODE_FORMAT.test(this.code)) {
      return 0;
    }
    const red = Number("0x" + this.code.slice(1, 3));
    if (Number.isNaN(red)) {
      return 0;
    }
    return red;
  }

  /**
   * 緑成分の値を取得する
   * @returns 緑成分の値
   */
  getGreen(): number {
    if (!TOURGBColor.CODE_FORMAT.test(this.code)) {
      return 0;
    }
    const green = Number("0x" + this.code.slice(3, 5));
    if (Number.isNaN(green)) {
      return 0;
    }
    return green;
  }

  /**
   * 青成分の値を取得する
   * @returns 青成分の値
   */
  getBlue(): number {
    if (!TOURGBColor.CODE_FORMAT.test(this.code)) {
      return 0;
    }
    const blue = Number("0x" + this.code.slice(5, 7));
    if (Number.isNaN(blue)) {
      return 0;
    }
    return blue;
  }

  setCode(code: string) {
    if (!TOURGBColor.CODE_FORMAT.test(code)) {
      // 色コードとしてふさわしくない値の場合は色を更新しない
      return;
    } else {
      this.code = code;
    }
  }

  setOpacity(opacity: number) {
    if (opacity < 0) {
      this.opacity = 0;
    } else if (opacity > 1) {
      this.opacity = 1;
    } else {
      this.opacity = opacity;
    }
  }

  /**
   * 数値からrgb値に変換する
   * @param red 赤成分の値
   * @param green 緑成分の値
   * @param blue 青成分の値
   * @returns rgb値
   */
  static numberToCode(red: number, green: number, blue: number): string {
    const convertToHex = (value: number) => {
      let color = value;
      if (value < 0) {
        color = 0;
      } else if (value > 255) {
        color = 255;
      }
      return color.toString(16).padStart(2, "0");
    };
    const r = convertToHex(red);
    const g = convertToHex(green);
    const b = convertToHex(blue);
    return `#${r}${g}${b}`;
  }
}

export class TOUHSBColor {
  hue: number;
  saturation: number;
  brightness: number;
  alpha: number;
  constructor(
    hue?: number,
    saturation?: number,
    brightness?: number,
    alpha?: number
  ) {
    // setterを通すことで範囲外引数が来ても範囲内に収まるようにする
    this.hue = hue ?? 0;
    this.setHue(this.hue);

    this.saturation = saturation ?? 0;
    this.setSaturation(this.saturation);

    this.brightness = brightness ?? 0;
    this.setBrightness(this.brightness);

    this.alpha = alpha ?? 1;
    this.setAlpha(this.alpha);
  }

  setHue(hue: number) {
    this.hue = Math.round(((hue / 360.0) % 1.0) * 360);
  }
  setSaturation(saturation: number) {
    if (saturation < 0) {
      this.saturation = 0;
    } else if (saturation > 1) {
      this.saturation = 1;
    } else {
      this.saturation = saturation;
    }
  }
  setBrightness(brightness: number) {
    if (brightness < 0) {
      this.brightness = 0;
    } else if (brightness > 1) {
      this.brightness = 1;
    } else {
      this.brightness = brightness;
    }
  }
  setAlpha(alpha: number) {
    if (alpha < 0) {
      this.alpha = 0;
    } else if (alpha > 1) {
      this.alpha = 1;
    } else {
      this.alpha = alpha;
    }
  }
  shiftHue(shift: number): TOUHSBColor {
    return new TOUHSBColor(
      Math.round((((this.hue + shift * 15) / 360.0) % 1.0) * 360),
      this.saturation,
      this.brightness,
      this.alpha
    );
  }

  rgba(): TOURGBColor {
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

    return new TOURGBColor(TOURGBColor.numberToCode(r, g, b), this.alpha);
  }
}
