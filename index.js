"use strict";

const directoryParser = require("./parsers/directory-parser");

const path = ".";
const exclude = ["*.js", "*.json", "node_modules"];

async function main() {
  const dataFiles = await directoryParser.parseDirectory(path, exclude);
  console.log(dataFiles);
}

main().then();
