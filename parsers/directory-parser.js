"use strict";

const utils = require("../utils");

function appendFileToData(path, dataFiles) {
  const file = utils.readFile(path);
  if (file) {
    dataFiles.push({
      path,
      content: file,
    });
  }
}

function createDataFileArray(rootPath, directoryFiles, excludedFiles) {
  let dataFiles = [];
  for (let index in directoryFiles) {
    const path = `${rootPath}/${directoryFiles[index]}`;
    const parsedDirectoryData = parseDirectoryFiles(path, excludedFiles);
    dataFiles = dataFiles.concat(...parsedDirectoryData);
    appendFileToData(path, dataFiles);
  }
  return dataFiles;
}

function parseDirectoryFiles(path, excludedFiles) {
  if (utils.isDirectory(path)) {
    const contentDirectory = utils.readDirectory(path);
    const directory = utils.filterArrayMinimatch(
      contentDirectory,
      excludedFiles
    );
    return createDataFileArray(path, directory, excludedFiles);
  }
  return [];
}

function generateDirectoryData(path, excludedFiles) {
  return parseDirectoryFiles(path, excludedFiles);
}

module.exports = {
  generateDirectoryData,
};
