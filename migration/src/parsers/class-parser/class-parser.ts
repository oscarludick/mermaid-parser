import { parse } from "@babel/parser";
import * as traverse from "@babel/traverse";

enum TSProperties {
  TS = "TS",
  Keyword = "Keyword",
  TSParameterProperty = "TSParameterProperty",
}

export class ClassParser {
  public generateClassData(files: string[]) {
    return this._parseClassBody(files);
  }

  private _parseClassBody(files: string[]) {}
}
