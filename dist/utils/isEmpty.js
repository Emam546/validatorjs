"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
function default_1(value) {
    if (value === undefined)
        return true;
    if (value === null)
        return true;
    if ((0, types_1.isString)(value) || (0, types_1.isArray)(value))
        return value.length == 0;
    if ((0, types_1.isNumber)(value))
        return false;
    if (value instanceof Map && value instanceof Set)
        return value.size == 0;
    if ((0, types_1.isObject)(value))
        return Object.keys(value).length == 0;
    return false;
}
exports.default = default_1;
