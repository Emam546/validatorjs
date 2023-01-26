"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.max = exports.min = void 0;
const Rule_1 = __importDefault(require("../Rule"));
const handelUndefined_1 = __importDefault(require("../utils/handelUndefined"));
const handelUnError_1 = __importDefault(require("../utils/handelUnError"));
const types_1 = require("../utils/types");
const minMax_1 = require("./Messages/minMax");
const unKnownValue_1 = __importDefault(require("./Messages/unKnownValue"));
const UnknownRule_1 = __importDefault(require("./Messages/UnknownRule"));
function getNumber(value, lang) {
    if ((0, types_1.isNumber)(value))
        return value;
    if ((0, types_1.isArray)(value) || (0, types_1.isString)(value))
        return value.length;
    if (value instanceof Set || value instanceof Map)
        return value.size;
    if ((0, types_1.isObject)(value))
        return Object.keys(value).length;
    const val = unKnownValue_1.default[lang];
    return (0, handelUndefined_1.default)(val);
}
function minFun(value, min, lang) {
    min = isNaN(min) ? 0 : min;
    if (value < min)
        return (0, handelUndefined_1.default)(minMax_1.MinError[lang]);
}
function maxFun(value, max, lang) {
    if (isNaN(max))
        return (0, handelUndefined_1.default)(UnknownRule_1.default[lang]);
    if (value > max)
        return (0, handelUndefined_1.default)(minMax_1.MaXError[lang]);
}
function MinHandler(...[value, name, , , lang]) {
    let min = parseFloat(name.split(":")[1]) || 0;
    const val = getNumber(value, lang);
    if ((0, types_1.isNumber)(val) && typeof val == "number")
        return minFun(val, min, lang);
    if (typeof val != "number")
        return val;
}
function MaxHandler(...[value, name, , , lang]) {
    let max = parseFloat(name.split(":")[1]);
    const val = getNumber(value, lang);
    if ((0, types_1.isNumber)(val) && typeof val == "number")
        return maxFun(val, max, lang);
    if (typeof val != "number")
        return val;
}
function limit(...[value, name, , , lang]) {
    let [, min, max] = name.split(":").map((e) => parseFloat(e));
    const val = getNumber(value, lang);
    if (typeof val == "number") {
        const minMess = minFun(val, min, lang);
        if (minMess == undefined) {
            const maxMess = maxFun(val, max, lang);
            if (maxMess != undefined)
                return maxMess;
        }
        return minMess;
    }
    else
        return val;
}
exports.min = new Rule_1.default(/^min(:-?\d+)?$/g, (...arr) => {
    return (0, handelUnError_1.default)(MinHandler(...arr), ...arr);
});
exports.max = new Rule_1.default(/^max:-?\d+$/g, (...arr) => {
    return (0, handelUnError_1.default)(MaxHandler(...arr), ...arr);
});
exports.default = new Rule_1.default(/^limit:-?\d+:-?\d+$/, (...arr) => {
    return (0, handelUnError_1.default)(limit(...arr), ...arr);
});
