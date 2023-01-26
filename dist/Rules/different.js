"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Rule_1 = __importDefault(require("../Rule"));
const compare_1 = __importDefault(require("../utils/compare"));
const handelUndefined_1 = __importDefault(require("../utils/handelUndefined"));
const handelUnError_1 = __importDefault(require("../utils/handelUnError"));
const ValuesNotSame_1 = __importDefault(require("./Messages/ValuesNotSame"));
function different(...[value, name, Validator, path, lang]) {
    const allPaths = path.split(".");
    const different = name.split(":").slice(1).join(":");
    const differentPath = allPaths.length > 1 ?
        allPaths.slice(0, allPaths.length - 1).join(".") + "." + different
        : different;
    const differentValue = Validator.getValue(differentPath);
    if (differentValue != undefined && (0, compare_1.default)(value, differentValue))
        return (0, handelUndefined_1.default)(ValuesNotSame_1.default[lang]);
}
const regEx = /^different:(.+)/ig;
exports.default = new Rule_1.default(regEx, (...arr) => {
    return (0, handelUnError_1.default)(different(...arr), ...arr);
});
