"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.before = exports.after = exports.date = exports.isDate = exports.Equal = exports.Before = exports.After = exports.NotValidDate = void 0;
const Rule_1 = __importDefault(require("../Rule"));
const handelMessage_1 = __importDefault(require("../utils/handelMessage"));
const isEmpty_1 = __importDefault(require("../utils/isEmpty"));
const types_1 = require("../utils/types");
exports.NotValidDate = { en: "THE DATE IS NOT VALID" };
exports.After = {
    en: (_, name) => `The Date is before ${getTimeName(name)} date`,
};
exports.Before = {
    en: (_, name) => `The Date is after ${getTimeName(name)} date`,
};
exports.Equal = {
    en: (_, name) => `The Date is not equal ${getTimeName(name)} date`,
};
function _getDateName(name) {
    const regExp = /^\w+:(.+)/gi;
    const res = regExp.exec(name);
    if (!res)
        return "";
    return res[1];
}
function isValidDate(dateString) {
    return getTime(dateString).toString() !== "Invalid Date";
}
function getTime(dateString) {
    if (dateString instanceof Date)
        return dateString;
    if ((0, isEmpty_1.default)(dateString))
        return new Date("Invalid Date");
    if ((0, types_1.isString)(dateString) && /(^\d+)$/.test(dateString) && !isNaN(parseInt(dateString))) {
        return new Date(parseInt(dateString));
    }
    else
        return new Date(dateString);
}
function getTimeName(name) {
    const dateName = _getDateName(name);
    if (dateName.startsWith("now")) {
        if (isNaN(parseInt(dateName.slice(4))))
            return new Date(Date.now());
        let num = Date.now();
        const inNum = parseInt(dateName.slice(4));
        switch (dateName.at(3)) {
            case "+":
                num += inNum;
                break;
            case "-":
                num -= inNum;
        }
        return new Date(num);
    }
    else {
        if (!isValidDate(dateName))
            throw new Error(`THE DATE ${dateName} IS NOT VALID`);
        return getTime(dateName);
    }
}
function isDateFn(...arr) {
    const [value, name, , , lang] = arr;
    if (!isValidDate(value))
        return (0, handelMessage_1.default)(exports.NotValidDate[lang], ...arr);
}
function afterfn(...arr) {
    const [dateV, name, , , lang] = arr;
    if (!isValidDate(dateV))
        return (0, handelMessage_1.default)(exports.NotValidDate[lang], ...arr);
    if (getTimeName(name) > getTime(dateV))
        return (0, handelMessage_1.default)(exports.After[lang], ...arr);
}
function beforefn(...arr) {
    const [value, name, , , lang] = arr;
    if (!isValidDate(value))
        return (0, handelMessage_1.default)(exports.NotValidDate[lang], ...arr);
    if (getTimeName(name) < getTime(value))
        return (0, handelMessage_1.default)(exports.Before[lang], ...arr);
}
function equal(...arr) {
    const [value, name, , , lang] = arr;
    if (!isValidDate(value))
        return (0, handelMessage_1.default)(exports.NotValidDate[lang], ...arr);
    if (Math.abs(getTimeName(name).getTime() - getTime(value).getTime()) > 1000)
        return (0, handelMessage_1.default)(exports.Before[lang], ...arr);
}
exports.isDate = new Rule_1.default("isDate", isDateFn);
exports.date = new Rule_1.default(/(^date:)/, equal);
exports.after = new Rule_1.default(/(^after:)/, afterfn);
exports.before = new Rule_1.default(/(^before:)/, beforefn);
