
import { Utilities } from "../../utilities";

import { CodeParser } from "./code-parser";
import { ClassNode } from "./class-parser.types";
import { TSProperties } from "./class-parser.enum";

export class ClassParser {
  private readonly _utils: Utilities;

  private readonly _codeParser: CodeParser;

  constructor() {
    this._utils = Utilities.getInstance();
    this._codeParser = new CodeParser();
  }

  public generateClassData(files: string[]) {
    return this._parseClassBody(files);
  }

  private _parseClassBody(files: string[]) {
    const extractedData: ClassNode[] = [];
    files.forEach((code) => {
      const extractedNodes = this._extractPropertiesAndMethods(code);
      const nodes = this._cleanNodes(extractedNodes);
      extractedData.push(...nodes);
    });
    return extractedData;
  }

  private _extractPropertiesAndMethods(code: string) {
    const ast = this._codeParser.parseTypescriptCode(code);
    const extractedNodes: ClassNode[] = [];
    this._codeParser.traverseTypescript(ast);
    return extractedNodes;
  }

  private _cleanNodes(nodes: ClassNode[]): ClassNode[] {
    const newNodes: ClassNode[] = [];
    const replacers = [TSProperties.Keyword, TSProperties.TS];
    for (const node of nodes) {
      const newNode = this._cleanNodeByKeys(node, replacers);
      newNodes.push(newNode);
    }
    return newNodes;
  }

  private _cleanNodeByKeys(node: ClassNode, replacers: string[]): ClassNode {
    const newNode = {} as ClassNode;
    const keys = Object.keys(node) as (keyof ClassNode)[];
    for (const key of keys) {
      const result = this._utils.common.replaceUnnecesaryText(
        node[key],
        replacers
      );
      Object.assign(newNode, { [key]: result });
    }
    return newNode;
  }
}
