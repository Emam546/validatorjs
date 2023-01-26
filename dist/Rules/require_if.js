"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.require_unless = exports.require_if = void 0;
const Rule_1 = __importDefault(require("../Rule"));
const compare_1 = __importDefault(require("../utils/compare"));
const getValue_1 = require("../utils/getValue");
const required_1 = require("./required");
function _require_if(...[inputs, name, validator, path, lang]) {
    let vpath, value;
    vpath = name.split(":")[1].split(",")[0];
    value = JSON.parse(name.split(":")[1].split(",").slice(1).join(","));
    const ObjectPath = path.split(".").slice(0, -1).join(".");
    const allObjects = (0, getValue_1.getAllValues)(inputs, ObjectPath);
    const Ppath = path.split(".").at(-1);
    let errors = {};
    if (Ppath)
        for (const objPath in allObjects) {
            const element = allObjects[objPath];
            const val = (0, getValue_1.getValue)(element, vpath);
            const finalPath = objPath ? objPath + "." + Ppath : Ppath;
            if ((0, compare_1.default)(val, value)) {
                errors = Object.assign(Object.assign({}, errors), (0, required_1.getValueMessage)(finalPath, inputs, "required", validator, Ppath, lang));
            }
        }
    return errors;
}
function _require_unless(...[inputs, name, validator, path, lang]) {
    let vpath, value;
    vpath = name.split(":")[1].split(",")[0];
    value = JSON.parse(name.split(":")[1].split(",").slice(1).join(","));
    const ObjectPath = path.split(".").slice(0, -1).join(".");
    const allObjects = (0, getValue_1.getAllValues)(inputs, ObjectPath);
    const Ppath = path.split(".").at(-1);
    let errors = {};
    if (Ppath)
        for (const objPath in allObjects) {
            const element = allObjects[objPath];
            const val = (0, getValue_1.getValue)(element, vpath);
            const finalPath = objPath ? objPath + "." + Ppath : Ppath;
            if (!(0, compare_1.default)(val, value)) {
                errors = Object.assign(Object.assign({}, errors), (0, required_1.getValueMessage)(finalPath, inputs, "required", validator, Ppath, lang));
            }
        }
    return errors;
}
exports.require_if = new Rule_1.default(/(^required_if:).+,[^,]+/, () => undefined, (name, Validator, ...a) => _require_if(Validator.inputs, name, Validator, ...a));
exports.require_unless = new Rule_1.default(/(^required_unless:).+,[^,]+/, () => undefined, (name, Validator, ...a) => _require_unless(Validator.inputs, name, Validator, ...a));
