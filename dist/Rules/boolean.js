"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Messages = void 0;
const Rule_1 = __importDefault(require("../Rule"));
const handelMessage_1 = __importDefault(require("../utils/handelMessage"));
exports.Messages = { "en": "The input value is no a boolean" };
exports.default = new Rule_1.default("boolean", (value, ...arr) => {
    return (value === true ||
        value === false ||
        value === 0 ||
        value === 1 ||
        value === '0' ||
        value === '1' ||
        value === 'true' ||
        value === 'false') ? undefined : (0, handelMessage_1.default)(exports.Messages[arr[3]], value, ...arr);
});
