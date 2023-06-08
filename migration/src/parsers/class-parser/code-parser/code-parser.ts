import * as t from "@babel/types";
import * as traverse from "@babel/traverse";

import { parse } from "@babel/parser";

import { Plugins, SourceTypes } from "./code-parser.enum";

export class CodeParser {
  public parseTypescriptCode(code: string): t.Node {
    return parse(code, {
      sourceType: SourceTypes.MODULE,
      plugins: [Plugins.TYPESCRIPT],
    });
  }

  public traverseTypescript(ast: t.Node, ...extractors: []) {
    traverse.default(ast, {
      ...extractors,
    });
  }
}
