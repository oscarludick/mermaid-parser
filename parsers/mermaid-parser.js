"use strict";

function getAccessibility(accessibility) {
  switch (accessibility) {
    case "public":
      return "+";
    case "private":
      return "-";
    case "protected":
      return "#";
    default:
      return "";
  }
}

function replaceGenericTypes(type) {
  return type.replace(/<|>/g, "~");
}

function cleanAnnotationType(type) {
  return type.replace(/String|Number|Boolean|(<[^<>]*>)*/g, (match) => {
    if (match.startsWith("<") && match.endsWith(">")) {
      const nestedMatch = match.substring(1, match.length - 1);
      return `<${nestedMatch.replace(
        /String|Number|Boolean|(<[^<>]*>)*/g,
        "$&"
      )}>`;
    }
    return "";
  });
}

function appendClassRelationship(
  relations,
  clazz,
  type,
  relationType,
  association
) {
  const cleanedType = cleanAnnotationType(type ?? "");
  if (!!cleanedType) {
    relations.push(
      `${clazz} ${association}  ${replaceGenericTypes(
        cleanedType
      )}:${relationType}\n`
    );
  }
}

function appendFunctionSyntax(syntax, item, relationships) {
  syntax += `${item.class} : ${getAccessibility(item.accessibility)}${
    item.name
  }(`;
  item.params.forEach((param, index) => {
    appendClassRelationship(
      relationships,
      item.class,
      param.propertyType,
      "HAS-A",
      "-->"
    );
    syntax += `${getAccessibility(
      param.accessibility
    )}${replaceGenericTypes(param.propertyType)} ${param.name}`;
    if (index < item.params.length - 1) {
      syntax += ", ";
    }
  });
  syntax +=
    item.type === "method"
      ? `) ${replaceGenericTypes(item.returnType)}\n`
      : ")\n";
  return syntax;
}

function generateMermaidSyntax(data) {
  const relationships = [];

  let mermaidSyntax = "";
  console.log(data);

  data.forEach((item) => {
    if (item.type === "class") {
      mermaidSyntax = `class ${item.name}\n` + mermaidSyntax;
      appendClassRelationship(
        relationships,
        item.name,
        item.extends,
        "IS-A",
        "--|>"
      );
      item.implements?.forEach((implement) => {
        appendClassRelationship(
          relationships,
          item.name,
          implement,
          "IMPLEMENTS",
          "..|>"
        );
      });
    } else if (item.type === "property") {
      appendClassRelationship(
        relationships,
        item.class,
        item.propertyType,
        "HAS-A",
        "-->"
      );
      mermaidSyntax += `${item.class} : ${getAccessibility(
        item.accessibility
      )}${replaceGenericTypes(item.propertyType)} ${item.name}${
        item.static ? "$" : ""
      }\n`;
    } else if (item.type === "constructor" || item.type === "method") {
      mermaidSyntax = appendFunctionSyntax(mermaidSyntax, item, relationships);
    }
  });

  return `classDiagram\n${mermaidSyntax}\n${relationships.join("")}`;
}

module.exports = {
  generateMermaidSyntax,
};
