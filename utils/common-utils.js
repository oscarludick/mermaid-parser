"use strict";

const minimatch = require("minimatch");

function tryNullOnError(fn) {
  try {
    return fn();
  } catch (error) {
    return null;
  }
}

function arrayFilterMinimatch(arr, patterns) {
  return arr.filter(
    (str) => !patterns.some((pattern) => minimatch.minimatch(str, pattern))
  );
}

module.exports = {
  tryNullOnError,
  arrayFilterMinimatch,
};
