"use strict";

function getAccessibility(accessibility) {
  switch (accessibility) {
    case "public":
      return "+";
    case "private":
      return "-";
    case "protected":
      return "#";
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
      relationships.push(item.class + " -->  " + item.propertyType + ": Has-A");

      mermaidSyntax += `${item.class} : ${getAccessibility(
        item.accessibility
      )}${item.propertyType} ${item.name}\n`;
    } else if (item.type === "constructor" || item.type === "method") {
      mermaidSyntax += `${item.class} : ${getAccessibility(
        item.accessibility
      )}${item.name}(`;
      item.params.forEach((param, index) => {
        relationships.push(item.class + " -->  " + item.propertyType + ": Has-A");
        
        mermaidSyntax += `${getAccessibility(item.accessibility)}${
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

  console.log(relationships);

  return mermaidSyntax;
}

module.exports = {
  generateMermaidSyntax,
};
