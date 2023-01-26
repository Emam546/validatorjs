"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Messages = void 0;
const Rule_1 = __importDefault(require("../Rule"));
const handelMessage_1 = __importDefault(require("../utils/handelMessage"));
exports.Messages = { "en": "THE VALUE is not accepted type" };
exports.default = new Rule_1.default("accepted", (value, ...arr) => {
    return (value === 'on' ||
        value === 'true' ||
        value === 'yes' ||
        value === 1 ||
        value === '1' ||
        value === true) ? undefined : (0, handelMessage_1.default)(exports.Messages[arr[3]], value, ...arr);
});
