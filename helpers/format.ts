// TODO: テストコード
export class FormatHelper {
  private constructor() {}

  /**
   * 渡された値がオブジェクトかを判定する
   * @param {any} value 判定する値
   * @returns {boolean} 値がオブジェクトならtrue、それ以外はfalse
   */
  static isObject(value: any): value is Object {
    return typeof value === "object" && value !== null;
  }

  /**
   * 渡された値が文字列かを判定する
   * @param {any} value 判定する値
   * @returns {boolean} 値が文字列ならtrue、それ以外はfalse
   */
  static isString(value: any): value is string {
    return typeof value === "string";
  }

  /**
   * 渡された値が数値かを判定する
   * @param {any} value 判定する値
   * @returns {boolean} 値が数値ならtrue、それ以外はfalse
   */
  static isNumber(value: any): value is number {
    return typeof value === "number";
  }

  /**
   * 渡された値が真偽値かを判定する
   * @param {any} value 判定する値
   * @returns {boolean} 値が真偽値ならtrue、それ以外はfalse
   */
  static isBoolean(value: any): value is boolean {
    return typeof value === "boolean";
  }

  /**
   * 渡された値が文字列の配列かを判定する
   * @param {any} value 判定する値
   * @returns {boolean} 値が文字列の配列ならtrue、それ以外はfalse
   */
  static isStringArray(value: any): value is string[] {
    if (!Array.isArray(value)) {
      return false;
    }
    return value.every((v) => this.isString(v));
  }

  /**
   * 渡された値が数値の配列かを判定する
   * @param {any} value 判定する値
   * @returns {boolean} 値が数値の配列ならtrue、それ以外はfalse
   */
  static isNumberArray(value: any): value is number[] {
    if (!Array.isArray(value)) {
      return false;
    }
    return value.every((v) => this.isNumber(v));
  }

  /**
   * 指定した型のプロパティが正しい型を持っているか判定する
   * @param {any} value 判定するオブジェクト
   * @param {Record<keyof T, (v: any) => boolean | Record<string, (v: any) => boolean>>} checkers 各プロパティの型チェック関数を含むオブジェクト
   * @returns {boolean} 値が指定された型の構造に適合していればtrue、それ以外はfalse
   */
  static isCorrect<T>(
    value: any,
    checkers: Record<
      keyof T,
      (v: any) => boolean | Record<string, (v: any) => boolean>
    >
  ): value is T {
    if (!this.isObject(value)) {
      return false;
    }
    return (Object.keys(checkers) as Array<keyof T>).every((key) => {
      const checker = checkers[key];
      if (typeof checker === "function") {
        const result = checker(value[key]);
        if (!result) {
          console.warn(`The key '${String(key)}' is inncorect format.`);
        }
        return result;
      }
      const result = this.isCorrect(value[key], checker);
      if (!result) {
        console.warn(`The key '${String(key)}' is inncorect format.`);
      }
      return result;
    });
  }

  /**
   * 指定した型のプロパティが正しい型の配列か判定する
   * @param {any} value 判定するオブジェクト
   * @param {Record<keyof T, (v: any) => boolean | Record<string, (v: any) => boolean>>} checkers 各プロパティの型チェック関数を含むオブジェクト
   * @returns {boolean} 値が指定された型の構造に適合している配列ならばtrue、それ以外はfalse
   */
  static isCorrectArray<T>(
    value: any,
    checkers: Record<
      keyof T,
      (v: any) => boolean | Record<string, (v: any) => boolean>
    >
  ): value is T[] {
    if (!Array.isArray(value)) {
      return false;
    }
    return value.every((v) => this.isCorrect<T>(v, checkers));
  }
}
