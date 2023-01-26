"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Messages = void 0;
const Rule_1 = __importDefault(require("../Rule"));
const handelMessage_1 = __importDefault(require("../utils/handelMessage"));
const types_1 = require("../utils/types");
exports.Messages = { "en": "THE TYPE OF INPUT IS NOT STRING" };
exports.default = new Rule_1.default("string", (value, ...arr) => {
    return (0, types_1.isString)(value) ? undefined : (0, handelMessage_1.default)(exports.Messages[arr[3]], value, ...arr);
});
