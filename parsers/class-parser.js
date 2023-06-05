"use strict";

const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;

function getTypescriptAST(code) {
  return parser.parse(code, {
    sourceType: "module",
    plugins: ["typescript"],
  });
}

function getCleanedDataType(dataType) {
  if (!dataType) {
    return null;
  }
  return dataType.replace("TS", "").replace("Keyword", "");
}

function extractMemberFunction(items) {
  return {
    MemberExpression(path) {
      const { scope, node } = path;
      if (node.object.type === "ThisExpression") {
        const relationName = scope.block.key?.name || scope.block.id?.name;
        const extractedItem = items.find((item) => item.name === relationName);
        if (extractedItem) {
          extractedItem.relations.push(node.property.name);
        }
      }
    },
  };
}

function extractClassProperty(extractedItems) {
  return {
    ClassProperty(path) {
      const { key, accessibility, typeAnnotation, value } = path.node;
      extractedItems.push({
        relations: [],
        name: key.name,
        static: path.node.static,
        type: "property",
        accessibility: accessibility || "public",
        class: path.parentPath.scope.block.id.name,
        initialValue: value ? value.value : undefined,
        propertyType: typeAnnotation?.typeAnnotation?.type || "unknown",
      });
    },
  };
}

function extractFunction(extractedItems) {
  const getParameterPropName = (param) => {
    const { type, parameter, name } = param;
    return type === "TSParameterProperty" ? parameter.name : name;
  };

  const getParameterPropType = (param) => {
    const { type, parameter, typeAnnotation } = param;
    if (type === "TSParameterProperty") {
      return (
        parameter.typeAnnotation?.typeAnnotation.typeName?.name ||
        parameter.typeAnnotation?.typeAnnotation.type
      );
    } else {
      return (
        typeAnnotation?.typeAnnotation.typeName?.name ||
        typeAnnotation?.typeAnnotation.type
      );
    }
  };

  return {
    Function(path) {
      const { key, accessibility, returnType, kind, params } = path.node;
      const extractedItem = {
        type: kind,
        relations: [],
        name: key.name,
        static: path.static,
        accessibility: accessibility || "public",
        class: path.parentPath.scope.block.id.name,
        returnType: returnType?.typeAnnotation.type,
        params: params.map((param) => ({
          accessibility: param.accessibility,
          name: getParameterPropName(param),
          propertyType: getParameterPropType(param),
        })),
      };
      extractedItems.push(extractedItem);
    },
  };
}

function extractPropertiesAndMethods(code) {
  const ast = getTypescriptAST(code);
  const extractedItems = [];
  traverse(ast, {
    ...extractFunction(extractedItems),
    ...extractClassProperty(extractedItems),
    ...extractMemberFunction(extractedItems),
  });
  return extractedItems;
}

function parseTypescriptClass(jsonData) {
  const extractedData = [];
  jsonData.forEach((data) => {
    const extractedItems = extractPropertiesAndMethods(data.content);
    extractedItems.forEach((item) => {
      item.sourcePath = data.path;
      item.returnType = getCleanedDataType(item.returnType);
      item.propertyType = getCleanedDataType(item.propertyType);
      item.params = item.params?.map((param) => ({
        ...param,
        propertyType: getCleanedDataType(param.propertyType),
      }));
    });
    extractedData.push(...extractedItems);
  });
  return extractedData;
}

function generateJsonClass(jsonData) {
  return parseTypescriptClass(jsonData);
}

module.exports = {
  generateJsonClass,
};
