"use strict";

const parsers = require("./parsers");
const utils = require("./utils");

const path = ".";
const exclude = ["*.js", "*.json", "node_modules", ".gitignore", ".git", "*.md"];

function main() {
  const dataFiles = parsers.generateDirectoryData(path, exclude);
  //console.log(dataFiles);

  const jsonData = parsers.generateJsonClass(dataFiles);
  //console.log(jsonData);

  const mermaidSyntax = parsers.generateMermaidSyntax(jsonData);
  //console.log(mermaidSyntax);

  const markdown = `\`\`\`mermaid\n${mermaidSyntax}\n\`\`\``;

  //console.log(markdown);

  utils.writeFile("structure.md", markdown);
}

main();

