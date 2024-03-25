export class IdUtils {
  private constructor() {}
  static readonly uuidFormat =
    "[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}";

  static generateUuid = () => {
    return "xxxx-xxxx-xxxx-xxxx-xxxx".replace(/x/g, function () {
      return Math.floor(Math.random() * 16).toString(16);
    });
  };
}
