const generateJsonClass = require("./class-parser").generateJsonClass;
const generateMermaidSyntax = require("./mermaid-parser").generateMermaidSyntax;
const generateDirectoryData =
  require("./directory-parser").generateDirectoryData;

module.exports = {
  generateJsonClass,
  generateMermaidSyntax,
  generateDirectoryData,
};
