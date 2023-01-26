"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Messages = void 0;
const Rule_1 = __importDefault(require("../Rule"));
const handelMessage_1 = __importDefault(require("../utils/handelMessage"));
exports.Messages = { "en": "THE URL IS NOT VALID" };
exports.default = new Rule_1.default("url", (value, ...arr) => {
    return /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-z]{2,63}\b([-a-zA-Z0-9@:%_\+.~#?&/=]*)/i.test(value) ? undefined : (0, handelMessage_1.default)(exports.Messages[arr[3]], value, ...arr);
});
