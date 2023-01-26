"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notIn = exports._in = exports.MessagesNotIn = exports.MessagesIn = void 0;
const Rule_1 = __importDefault(require("../Rule"));
const handelMessage_1 = __importDefault(require("../utils/handelMessage"));
exports.MessagesIn = { "en": "The value is not in the array" };
exports.MessagesNotIn = { "en": "The value is in the array" };
function contains(...[value, name]) {
    const values = name.split(":").slice(1, name.split(":").length).join(":").split(",");
    return values.includes(value);
}
exports._in = new Rule_1.default(/^in:\S+/, (...arr) => contains(...arr) ? undefined : (0, handelMessage_1.default)(exports.MessagesIn[arr[4]], ...arr));
exports.notIn = new Rule_1.default(/^not_in:\S+/, (...arr) => !contains(...arr) ? undefined : (0, handelMessage_1.default)(exports.MessagesNotIn[arr[4]], ...arr));
