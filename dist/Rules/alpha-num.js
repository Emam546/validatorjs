"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Rule_1 = __importDefault(require("../Rule"));
const handelMessage_1 = __importDefault(require("../utils/handelMessage"));
const Messages = { "en": "The input value must contains only characters or numeric values" };
exports.default = new Rule_1.default("alpha_num", (value, ...arr) => {
    return /^[a-zA-Z0-9]+$/.test(value) ? undefined : (0, handelMessage_1.default)(Messages[arr[3]], value, ...arr);
});
