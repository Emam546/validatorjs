"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unMatchedValues = void 0;
const constructObj_1 = __importDefault(require("./constructObj"));
const types_1 = require("./types");
function unMatchedValues(input, unMatchObj, addedPath = "") {
    if (input == undefined)
        return null;
    if (typeof unMatchObj == "undefined")
        return { [addedPath]: { message: "invalid path", value: input } };
    if (unMatchObj == null)
        return null;
    let errors = {};
    if (unMatchObj instanceof Array) {
        const [, _type] = unMatchObj;
        if (_type == "array" && !(0, types_1.isArray)(input))
            return {
                [addedPath]: { message: "Unmatched type value", value: input },
            };
        if (unMatchObj[0])
            for (const key in input)
                errors = Object.assign(Object.assign({}, errors), unMatchedValues(input[key], unMatchObj[0], `${addedPath}*${key}.`));
    }
    else {
        for (const key in input)
            errors = Object.assign(Object.assign({}, errors), unMatchedValues(input[key], unMatchObj[key], `${addedPath}${key}.`));
    }
    if (Object.values(errors).length == 0)
        return null;
    return errors;
}
exports.unMatchedValues = unMatchedValues;
function default_1(input, rules) {
    const RulesObj = (0, constructObj_1.default)(rules);
    return unMatchedValues(input, RulesObj);
}
exports.default = default_1;
