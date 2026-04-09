// TODO: テストコード作成
export class JsonUtils {
  private constructor() {}

  static deepCopy<T>(value: T): T {
    return JSON.parse(JSON.stringify(value));
  }
}
