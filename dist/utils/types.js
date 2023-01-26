"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNumeric = exports.onlyDigits = exports.isNumber = exports.isArray = exports.isString = exports.isObject = void 0;
function isObject(attr) {
    return typeof attr === "object" && !Array.isArray(attr) && attr !== null;
}
exports.isObject = isObject;
function isString(value) {
    return typeof value === "string" || value instanceof String;
}
exports.isString = isString;
function isArray(value) {
    return (value instanceof Array ||
        Object.prototype.toString.call(value) === "[object Array]");
}
exports.isArray = isArray;
function isNumber(value) {
    return (!isNaN(value) && (value instanceof Number || typeof value == "number"));
}
exports.isNumber = isNumber;
function onlyDigits(str) {
    const num = Number(str);
    return !isNaN(num) && typeof str !== "boolean";
}
exports.onlyDigits = onlyDigits;
function isNumeric(value) {
    return (onlyDigits(value) && !isArray(value));
}
exports.isNumeric = isNumeric;
