export const useShortcutKey = (
  keys: Array<{
    code: string;
    onKeydown?: Function;
    onKeyup?: Function;
  }>
) => {
  class TOUKeyController {
    isKeydown: boolean;
    code: string;
    keydownFunc: Function;
    keyupFunc: Function;
    constructor(key: {
      code: string;
      onKeydown?: Function;
      onKeyup?: Function;
    }) {
      this.isKeydown = false;
      this.code = key.code;
      this.keydownFunc = key.onKeydown ?? (() => {});
      this.keyupFunc = key.onKeyup ?? (() => {});
    }

    onKeydown() {
      this.isKeydown = true;
      this.keydownFunc();
    }
    onKeyup() {
      this.keyupFunc();
      this.isKeydown = false;
    }
  }
  const shortcuts = keys.map((key) => new TOUKeyController(key));
  const isKeydown = (keyCode: string): boolean => {
    const shortcut = shortcuts.find((key) => key.code === keyCode);
    if (!shortcut) {
      return false;
    }
    return shortcut.isKeydown;
  };
  const onKeydown = (event: KeyboardEvent): void => {
    const shortcut = shortcuts.find((key) => key.code === event.code);
    if (!shortcut) {
      return;
    }
    event.preventDefault();
    shortcut.onKeydown();
  };

  const onKeyup = (event: KeyboardEvent): void => {
    const shortcut = shortcuts.find((key) => key.code === event.code);
    if (!shortcut) {
      return;
    }
    event.preventDefault();
    shortcut.onKeyup();
  };

  const addShortcutKey = () => {
    window.addEventListener("keydown", onKeydown);
    window.addEventListener("keyup", onKeyup);
  };
  const removeShortcutKey = () => {
    window.removeEventListener("keydown", onKeydown);
    window.removeEventListener("keyup", onKeyup);
  };

  return {
    isKeydown,
    addShortcutKey,
    removeShortcutKey,
  };
};
