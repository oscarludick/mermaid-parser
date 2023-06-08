import { minimatch } from "minimatch";

export class CommonUtilities {
  public tryNullOnError<T>(fn: () => T) {
    try {
      return fn();
    } catch (error) {
      return null;
    }
  }

  public excludeItemWithPattern(array: string[], patterns: string[]): string[] {
    if (!patterns || !array) {
      return array;
    }
    return array.filter((text) => !patterns.some((p) => minimatch(text, p)));
  }

  public replaceUnnecesaryText<T>(
    item: T | T[] | string,
    replace: string[]
  ): T | T[] | string | null {
    if (item === null || item === undefined) {
      return null;
    }
    if (Array.isArray(item)) {
      return item.map((i) => this.replaceUnnecesaryText(i, replace)) as T[];
    }
    if (typeof item === "string") {
      replace.forEach((r) => (item = (item as string).replace(r, "")));
    }
    return item;
  }
}
