"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constructObj_1 = __importDefault(require("./constructObj"));
const types_1 = require("./types");
function matchObjs(input, matchObj) {
    if (matchObj === null)
        return input;
    if (input === undefined)
        return input;
    if (matchObj instanceof Array) {
        const [, _type] = matchObj;
        const newObj = _type == "array" ? [] : {};
        if (_type == "array" && !(0, types_1.isArray)(input))
            return [];
        if ((0, types_1.isArray)(input))
            for (let i = 0; i < input.length; i++)
                newObj[i] = matchObjs(input[i], matchObj[0]);
        else {
            for (const key in input)
                newObj[key] = matchObjs(input[key], matchObj[0]);
        }
        return newObj;
    }
    else {
        const newObj = {};
        for (const key in matchObj) {
            if (input[key] !== undefined)
                newObj[key] = matchObjs(input[key], matchObj[key]);
        }
        return newObj;
    }
}
function default_1(input, rules) {
    const RulesObj = (0, constructObj_1.default)(rules);
    return matchObjs(input, RulesObj);
}
exports.default = default_1;
