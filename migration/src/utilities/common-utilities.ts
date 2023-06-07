import { minimatch } from "minimatch";

export class CommonUtilities {
  public tryNullOnError<T>(fn: () => T) {
    try {
      return fn();
    } catch (error) {
      return null;
    }
  }

  public filterArrayMinimatch(arr: string[], patterns: string[]): string[] {
    return arr.filter((str) => !patterns.some((p) => minimatch(str, p)));
  }
}
