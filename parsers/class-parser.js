"use strict";

const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;

const mermaidParser = require("./mermaid-parser");

function extractPropertiesAndMethods(code) {
  const ast = parser.parse(code, {
    sourceType: "module",
    plugins: ["typescript"],
  });

  const extractedItems = [];

  traverse(ast, {
    ClassProperty(path) {
      const { key, accessibility, typeAnnotation, value } = path.node;
      const extractedItem = {
        class: path.parentPath.scope.block.id.name,
        static: path.static,
        type: "property",
        name: key.name,
        accessibility: accessibility || "public",
        propertyType: typeAnnotation?.typeAnnotation?.type || "unknown",
        initialValue: value ? value.value : undefined,
        relations: [],
      };
      extractedItems.push(extractedItem);
    },
    Function(path) {
      const { key, accessibility, returnType, kind, params } = path.node;
      const extractedItem = {
        class: path.parentPath.scope.block.id.name,
        static: path.static,
        type: kind,
        name: key.name,
        accessibility: accessibility || "public",
        returnType: returnType?.typeAnnotation.type,
        relations: [],
        params: params.map((param) => {
          return {
            accessibility: param.accessibility,
            name:
              param.type === "TSParameterProperty"
                ? param.parameter.name
                : param.name,
            propertyType:
              param.type === "TSParameterProperty"
                ? param.parameter.typeAnnotation?.typeAnnotation.typeName
                    ?.name ||
                  param.parameter.typeAnnotation?.typeAnnotation.type
                : param.typeAnnotation?.typeAnnotation.typeName?.name ||
                  param.typeAnnotation?.typeAnnotation.type,
          };
        }),
      };
      extractedItems.push(extractedItem);
    },
    MemberExpression(path) {
      const relationName =
        path.scope.block.key?.name || path.scope.block.id?.name;
      if (path.node.object.type === "ThisExpression") {
        const extractedItem = extractedItems.find(
          (item) => item.name === relationName
        );
        if (extractedItem) {
          extractedItem.relations.push(path.node.property.name);
        }
      }
    },
  });

  return extractedItems;
}

function cleanDataType(dataType) {
  if (!dataType) {
    return null;
  }
  return dataType.replace("TS", "").replace("Keyword", "");
}

const jsonData = [
  {
    path: "./mocks/test.ts",
    content:
      "export class Test {\n" +
      "    private variableOne: string;\n" +
      "\n" +
      "    public variableTwo: number = this.variableOne;\n" +
      "\n" +
      "    constructor(private _dep: DepOne, public depTwo: number) {}\n" +
      "\n" +
      "    private onMethodOne(numericValue: number): string {\n" +
      "        return numericValue + this.variableOne;\n" +
      "    }\n" +
      "}",
  },
  {
    path: './mocks/test2.ts',
    content: 'export class Test2 {\n' +
      '    private variableOne: string;\n' +
      '\n' +
      '    public variabletwo: number;\n' +
      '\n' +
      '    constructor() {}\n' +
      '\n' +
      '    public onMethodOne(numericValue: number): string {\n' +
      '        return numericValue + "";\n' +
      '    }\n' +
      '}'
  }
];

const extractedData = [];

jsonData.forEach((data) => {
  const extractedItems = extractPropertiesAndMethods(data.content);
  extractedItems.forEach((item) => {
    item.propertyType = cleanDataType(item.propertyType);
    item.returnType = cleanDataType(item.returnType);
    item.params = item.params?.map((param) => ({
      ...param,
      propertyType: cleanDataType(param.propertyType),
    }));
    item.sourcePath = data.path;
  });
  extractedData.push(...extractedItems);
});

console.log(JSON.stringify(extractedData, null, 2));

const mermaidSyntax = mermaidParser.generateMermaidSyntax(extractedData);
console.log(mermaidSyntax);
