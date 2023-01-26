"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.require_withoutAll = exports.require_without = void 0;
const Rule_1 = __importDefault(require("../Rule"));
const getValue_1 = require("../utils/getValue");
const required_1 = require("./required");
function _require_without(...[inputs, name, validator, path, lang]) {
    let vpaths = name.split(":")[1].split(",");
    const ObjectPath = path.split(".").slice(0, -1).join(".");
    const allObjects = (0, getValue_1.getAllValues)(inputs, ObjectPath);
    const Ppath = path.split(".").at(-1);
    let errors = {};
    if (Ppath)
        for (const objPath in allObjects) {
            const element = allObjects[objPath];
            const finalPath = objPath ? objPath + "." + Ppath : Ppath;
            if (vpaths.some((vpath) => (0, getValue_1.getValue)(element, vpath) === undefined)) {
                errors = Object.assign(Object.assign({}, errors), (0, required_1.getValueMessage)(finalPath, inputs, "required", validator, Ppath, lang));
            }
        }
    return errors;
}
function _require_withoutAll(...[inputs, name, validator, path, lang]) {
    let vpaths = name.split(":")[1].split(",");
    const ObjectPath = path.split(".").slice(0, -1).join(".");
    const allObjects = (0, getValue_1.getAllValues)(inputs, ObjectPath);
    const Ppath = path.split(".").at(-1);
    let errors = {};
    if (Ppath)
        for (const objPath in allObjects) {
            const element = allObjects[objPath];
            const finalPath = objPath ? objPath + "." + Ppath : Ppath;
            if (vpaths.every((vpath) => (0, getValue_1.getValue)(element, vpath) === undefined)) {
                errors = Object.assign(Object.assign({}, errors), (0, required_1.getValueMessage)(finalPath, inputs, "required", validator, Ppath, lang));
            }
        }
    return errors;
}
exports.require_without = new Rule_1.default(/^required_without:(.+,)*[^,]+/, () => undefined, (name, Validator, ...a) => _require_without(Validator.inputs, name, Validator, ...a));
exports.require_withoutAll = new Rule_1.default(/^required_withoutALl:(.+,)*[^,]+/, () => undefined, (name, Validator, ...a) => _require_withoutAll(Validator.inputs, name, Validator, ...a));
