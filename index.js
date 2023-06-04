"use strict";

const classParser = require("./parsers/class-parser");
const mermaidParser = require("./parsers/mermaid-parser");
const directoryParser = require("./parsers/directory-parser");

const path = ".";
const exclude = ["*.js", "*.json", "node_modules", ".gitignore", ".git"];

async function main() {
  const dataFiles = await directoryParser.generateDirectoryData(path, exclude);
  console.log(dataFiles);

  const jsonData = classParser.generateClassJson(dataFiles);
  console.log(jsonData);

  const mermaidSyntax = mermaidParser.generateMermaidSyntax(jsonData);
  console.log(mermaidSyntax);
}

main().then();
