"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._regExp = void 0;
const Rule_1 = __importDefault(require("../Rule"));
const handelMessage_1 = __importDefault(require("../utils/handelMessage"));
const ValuesNotSame_1 = __importDefault(require("./Messages/ValuesNotSame"));
exports._regExp = /^regex:\/(.+)\/(\w*)$/gi;
function regExp(...arr) {
    const [value, name, , , lang] = arr;
    const match = exports._regExp.exec(name);
    if (!match)
        return "undefined regular expression";
    const [, regEx, iden] = match;
    const res = new RegExp(regEx, iden).test(value);
    if (!res)
        return (0, handelMessage_1.default)(ValuesNotSame_1.default[lang], ...arr);
}
exports.default = new Rule_1.default(exports._regExp, regExp);
