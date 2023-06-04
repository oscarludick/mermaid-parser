"use strict";

const fs = require("fs");
const commonUtils = require("./common-utils");

function isDirectory(path) {
  return commonUtils.tryNullOnError(() => fs.lstatSync(path).isDirectory());
}

function readDirectory(path) {
  return commonUtils.tryNullOnError(() => fs.readdirSync(path));
}

function readFile(path, encoding = "utf8") {
  return commonUtils.tryNullOnError(() => fs.readFileSync(path, encoding));
}

module.exports = {
  readDirectory,
  readFile,
  isDirectory,
};
