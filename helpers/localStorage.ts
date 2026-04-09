// TODO: テストコード
export class LocalStorageHelper {
  private constructor() {}

  /**
   * ローカルストレージにオブジェクトを保存する
   * @param {string} key 保存時のキー
   * @param {Object} object 保存するオブジェクト
   */
  static save(key: string, object: Object): void {
    localStorage.setItem(`tou.${key}`, JSON.stringify(object));
  }

  /**
   * ローカルストレージからオブジェクトを読み込む
   * @param {string} key 取得するオブジェクトのキー
   * @returns {Object | null} ローカルストレージから取得したオブジェクト(取得できなかった場合はnull)
   */
  static load(key: string): Object | null {
    const object = localStorage.getItem(`tou.${key}`);
    if (!object) {
      return null;
    }
    return JSON.parse(object);
  }
}
