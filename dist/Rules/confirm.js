"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Rule_1 = __importDefault(require("../Rule"));
const compare_1 = __importDefault(require("../utils/compare"));
const handelUndefined_1 = __importDefault(require("../utils/handelUndefined"));
const handelUnError_1 = __importDefault(require("../utils/handelUnError"));
const valueNotExist_1 = __importDefault(require("./Messages/valueNotExist"));
const ValuesNotSame_1 = __importDefault(require("./Messages/ValuesNotSame"));
function Confirm(...[value, name, validator, path, lang]) {
    const returnedValue = validator.getValue(path + "_confirmation");
    if (returnedValue == undefined)
        return (0, handelUndefined_1.default)(valueNotExist_1.default[lang]);
    if (!(0, compare_1.default)(value, returnedValue))
        return (0, handelUndefined_1.default)(ValuesNotSame_1.default[lang]);
}
exports.default = new Rule_1.default("confirm", (...arr) => {
    return (0, handelUnError_1.default)(Confirm(...arr), ...arr);
});
