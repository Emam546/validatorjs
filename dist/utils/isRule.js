"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.is_Rule = void 0;
const types_1 = require("./types");
function is_Rule(array) {
    return (array != null &&
        (0, types_1.isArray)(array) && array instanceof Array &&
        !array.some((v) => {
            return !(0, types_1.isString)(v);
        }));
}
exports.is_Rule = is_Rule;
