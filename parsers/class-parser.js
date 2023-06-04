"use strict";

const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;

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

function generateClassJson(jsonData) {
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

  return extractedData;
}

module.exports = {
  generateClassJson,
};
