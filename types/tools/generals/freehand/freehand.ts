import type { TOUSavable } from "@/types/common/savable";
import { TOUFreehandNoteOperation } from "@/types/tools/generals/freehand/operation";

/**
 * 手書きメモの管理クラス
 */
export class TOUFreehandNote implements TOUSavable {
  log: Array<TOUFreehandNoteOperation> = [];
  current: number = -1;

  /**
   * ログの追加
   * @param event 追加するイベント
   */
  add(event: TOUFreehandNoteOperation) {
    if (this.current === this.log.length - 1) {
      // 現在位置が終端ならそのまま追加
      this.log.push(event);
    } else {
      // 現在位置が終端以外なら現在位置より後ろのログを消す
      this.log = this.log.slice(0, this.current + 1);
      this.log.push(event);
    }
    this.current++;
  }

  /**
   * 現在位置をひとつ前にする
   * @returns
   */
  goBack() {
    if (this.current < 0) {
      return;
    }
    this.current--;
  }

  /**
   * 現在位置をひとつ後ろにする
   * @returns
   */
  goForward() {
    if (this.current >= this.log.length - 1) {
      return;
    }
    this.current++;
  }

  /**
   * 現在位置の操作を取得する
   * @returns 現在位置の操作
   */
  getCurrent(): TOUFreehandNoteOperation {
    return this.log[this.current];
  }

  /**
   * 現在位置までの操作を再現し、canvasに描画する
   * @param canvas 描画を行うcanvasDOM
   * @returns
   */
  reproduce(canvas: HTMLCanvasElement) {
    const drawer = canvas.getContext("2d");
    if (!drawer) {
      return;
    }
    drawer.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i <= this.current; i++) {
      this.log[i].reproduce(canvas, drawer);
    }
  }

  toJson(): Object {
    return {
      log: this.log.map((operation) => operation.toJson()),
      current: this.current,
    };
  }

  /**
   * JSONデータからのオブジェクトの構築
   * @returns 構築したTOUFreehandNoteインスタンス
   */
  static build(object: any): TOUFreehandNote {
    const note = new TOUFreehandNote();
    if (!Array.isArray(object.log)) {
      return note;
    }

    // ログの構築
    const log = new Array<TOUFreehandNoteOperation>();
    for (const operation of object.log) {
      const op = TOUFreehandNoteOperation.build(operation);
      if (!op) {
        continue;
      }
      log.push(op);
    }
    note.log = log;

    // 現在位置の設定
    if (typeof object.current === "number") {
      note.current = object.current;
    } else {
      // 現在位置が保存されてない場合は現在地を終端にする
      note.current = note.log.length - 1;
    }

    return note;
  }
}
