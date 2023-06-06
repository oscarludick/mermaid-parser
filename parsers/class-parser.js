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

const getParameterPropName = (param) => {
  const { type, parameter, name } = param;
  return type === "TSParameterProperty" ? parameter.name : name;
};

const getParameterPropType = (param) => {
  const { type, parameter, typeAnnotation } = param;
  if (type === "TSParameterProperty") {
    return getFullTypeAnnotationName(parameter);
  } else {
    return getFullTypeAnnotationName(typeAnnotation);
  }
};

function getTypeName(typeNode) {
  return (
    typeNode?.typeAnnotation?.typeAnnotation?.typeName?.name ||
    typeNode?.typeAnnotation?.typeName?.name ||
    typeNode?.typeAnnotation?.type ||
    typeNode?.typeName?.name ||
    typeNode?.type
  );
}

function getTypeParameterNames(typeParameters) {
  const result = [];
  if (typeParameters) {
    typeParameters.params.forEach((param) => {
      result.push(getTypeName(param));
      if (param.typeParameters) {
        result.push(...getTypeParameterNames(param.typeParameters));
      }
    });
  }
  return result;
}

function getFullTypeAnnotationName(typeNode) {
  const typeParameters = typeNode?.typeAnnotation?.typeParameters;

  const typeName = getTypeName(typeNode);
  const typeParameterNames = getTypeParameterNames(typeParameters);

  const fullTypeName = typeParameterNames.reduce((fullType, type, index) => {
    fullType = `${fullType}<${type}`;
    if (index === typeParameterNames.length - 1) {
      fullType = `${fullType}${typeParameterNames.map(() => ">").join("")}`;
    }
    return fullType;
  }, typeName);

  return fullTypeName;
}

function extractMemberExpression(items) {
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
        propertyType: getFullTypeAnnotationName(typeAnnotation),
      });
    },
  };
}

function extractMethod(extractedItems) {
  return {
    Class(rootPath) {
      const nodes = rootPath.node.body.body.filter(
        (node) => node.type === "ClassMethod" || node.type === "TSDeclareMethod"
      );
      nodes.forEach((path) => {
        // path.body.body.forEach(((x)=>{
        //   console.log(x)
        // }))
        const { key, accessibility, returnType, kind, params } = path;
        const extractedItem = {
          type: kind,
          relations: [],
          name: key.name,
          static: path.static,
          abstract: path.abstract,
          accessibility: accessibility || "public",
          class: rootPath.node.id.name,
          extends: rootPath.node.superClass?.name,
          implements: rootPath.node.implements?.map(
            (node) => node.expression.name
          ),
          returnType: getFullTypeAnnotationName(returnType),
          params: params.map((param) => ({
            accessibility: param.accessibility,
            name: getParameterPropName(param),
            propertyType: getParameterPropType(param),
          })),
        };
        extractedItems.push(extractedItem);
      });
    },
  };
}

function extractPropertiesAndMethods(code) {
  const ast = getTypescriptAST(code);
  const extractedItems = [];
  traverse(ast, {
    ...extractMethod(extractedItems),
    ...extractClassProperty(extractedItems),
    ...extractMemberExpression(extractedItems),
    ObjectTypeAnnotation(path) {
      console.log(path.node)
    },
    ClassDeclaration(path) {
      extractedItems.push({
        type: "class",
        abstract: path.node.abstract,
        name: path.node.id.name,
        extends: path.node.superClass?.name,
        implements: path.node.implements?.map((node) => node.expression.name),
      });
    },
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
