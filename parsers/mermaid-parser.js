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

function appendClassRelationship(relations, clazz, propertyType) {
  if (!propertyType.match(/String|Number|Boolean/gi)) {
    relations.push(clazz + " -->  " + propertyType + ": Has-A");
  }
}

function generateMermaidSyntax(data) {
  const classNames = [];
  const relationships = [];

  let mermaidSyntax = "";

  data.forEach((item) => {
    if (!classNames.includes(item.class)) {
      classNames.push(item.class);
    }

    if (item.type === "property") {
      appendClassRelationship(relationships, item.class, item.propertyType);
      mermaidSyntax += `${item.class} : ${getAccessibility(
        item.accessibility
      )}${item.propertyType} ${item.name}${item.static ? "$" : ""}\n`;
    } else if (item.type === "constructor" || item.type === "method") {
      mermaidSyntax += `${item.class} : ${getAccessibility(
        item.accessibility
      )}${item.name}(`;
      item.params.forEach((param, index) => {
        appendClassRelationship(relationships, item.class, param.propertyType);
        mermaidSyntax += `${getAccessibility(param.accessibility)}${
          param.propertyType
        } ${param.name}`;
        if (index < item.params.length - 1) {
          mermaidSyntax += ", ";
        }
      });
      mermaidSyntax +=
        item.type === "method" ? `) ${item.returnType}\n` : ")\n";
    }
  });

  classNames.forEach((className) => {
    mermaidSyntax = `class ${className}\n` + mermaidSyntax;
  });

  return `classDiagram\n${mermaidSyntax}\n${relationships}`;
}

module.exports = {
  generateMermaidSyntax,
};
