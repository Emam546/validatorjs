"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Messages = void 0;
const Rule_1 = __importDefault(require("../Rule"));
const handelMessage_1 = __importDefault(require("../utils/handelMessage"));
exports.Messages = { "en": "THE PASSWORD IS NOT VALID" };
exports.default = new Rule_1.default("password", (value, ...arr) => {
    return /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/.test(value) ? undefined : (0, handelMessage_1.default)(exports.Messages[arr[3]], value, ...arr);
});
