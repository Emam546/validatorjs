"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const handelUndefined_1 = __importDefault(require("./handelUndefined"));
function default_1(mess, ...arr) {
    mess = (0, handelUndefined_1.default)(mess);
    if (typeof mess == "function")
        return mess(...arr);
    else
        return mess;
}
exports.default = default_1;
