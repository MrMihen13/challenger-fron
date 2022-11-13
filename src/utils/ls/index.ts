export class LS {
  static setItem(key: string, value: any) {
    if (!localStorage) {
      return null;
    }
    localStorage.setItem(key, JSON.stringify(value));
  }

  static getItem<T extends any>(key: string) {
    if (!localStorage) {
      return null;
    }
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : item;
  }

  static removeItem(key: string) {
    if (!localStorage) {
      return null;
    }
    localStorage.removeItem(key);
  }
}
