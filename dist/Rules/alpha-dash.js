"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Messages = void 0;
const Rule_1 = __importDefault(require("../Rule"));
const handelMessage_1 = __importDefault(require("../utils/handelMessage"));
exports.Messages = { "en": "The input value contains alpha-numeric characters, as well as dashes and underscores." };
exports.default = new Rule_1.default("alpha_dash", (value, ...arr) => {
    return /^[a-zA-Z0-9_\-]+$/.test(value) ? undefined : (0, handelMessage_1.default)(exports.Messages[arr[3]], value, ...arr);
});
