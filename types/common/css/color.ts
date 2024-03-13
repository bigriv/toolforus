export class TOUColor {
  static readonly CODE_BLACK = "#000000";
  static readonly CODE_WHITE = "#ffffff";
  static readonly CODE_FORMAT = /^#[0-9a-fA-F]{6}$/;

  code: string;
  opacity: number;

  constructor(code?: string, opacity?: number) {
    if (!code || !TOUColor.CODE_FORMAT.test(code)) {
      // 色コードとしてふさわしくない値の場合は強制的に白にする
      this.code = "#ffffff";
    } else {
      this.code = code;
    }

    if (!opacity && opacity !== 0) {
      this.opacity = !code ? 0 : 1;
    } else {
      if (opacity < 0) {
        this.opacity = 0;
      } else if (opacity > 1) {
        this.opacity = 1;
      } else {
        this.opacity = opacity;
      }
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

  /**
   * 赤成分の値を取得する
   * @returns 赤成分の値
   */
  getRed(): number {
    if (!TOUColor.CODE_FORMAT.test(this.code)) {
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
    if (!TOUColor.CODE_FORMAT.test(this.code)) {
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
    if (!TOUColor.CODE_FORMAT.test(this.code)) {
      return 0;
    }
    const blue = Number("0x" + this.code.slice(5, 7));
    if (Number.isNaN(blue)) {
      return 0;
    }
    return blue;
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
