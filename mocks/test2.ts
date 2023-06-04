import { Test } from "./test";

export class Test2 {
  private variableOne: string;

  public variabletwo: number;

  constructor(private _test: Test) {}

  public onMethodOne(numericValue: number): string {
    return numericValue + "";
  }
}
