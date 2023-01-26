"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getValueMessage = void 0;
const Rule_1 = __importDefault(require("../Rule"));
const getValue_1 = require("../utils/getValue");
const handelMessage_1 = __importDefault(require("../utils/handelMessage"));
const types_1 = require("../utils/types");
const valueNotExist_1 = __importDefault(require("./Messages/valueNotExist"));
function getValueMessage(orgPath, ...[inputs, name, validator, path, lang]) {
    const paths = orgPath.split(".");
    let currObj = inputs;
    for (let i = 0; i < paths.length; i++) {
        if (paths[i].startsWith("*")) {
            const index = parseInt(paths[i].slice(1));
            const respath = paths.slice(i).join(".");
            if (isNaN(index)) {
                const message = `unrecognizable number ${paths[i]}`;
                return { [respath]: [{ message, value: currObj[paths[i]] }] };
            }
            paths[i] = index;
            if (!(0, types_1.isArray)(currObj)) {
                const message = "the value is not an array";
                return { [respath]: [{ message, value: currObj[paths[i]] }] };
            }
        }
        if (typeof currObj[paths[i]] == "undefined") {
            const message = (0, handelMessage_1.default)(valueNotExist_1.default[lang], inputs, name, validator, path, lang);
            const respath = paths.slice(i).join(".");
            return { [respath]: [{ message, value: currObj[paths[i]] }] };
        }
        else
            currObj = currObj[paths[i]];
    }
    return {};
}
exports.getValueMessage = getValueMessage;
function require_if(...[inputs, name, validator, path, lang]) {
    const ObjectPath = path.split(".").slice(0, -1).join(".");
    const allObjects = (0, getValue_1.getAllValues)(inputs, ObjectPath);
    const Ppath = path.split(".").at(-1);
    let errors = {};
    if (Ppath)
        for (const objPath in allObjects) {
            const element = allObjects[objPath];
            const finalPath = objPath ? objPath + "." + Ppath : Ppath;
            if ((0, getValue_1.getValue)(element, Ppath) === undefined) {
                errors = Object.assign(Object.assign({}, errors), getValueMessage(finalPath, inputs, "required", validator, Ppath, lang));
            }
        }
    return errors;
}
exports.default = new Rule_1.default("required", () => undefined, (name, Validator, ...a) => require_if(Validator.inputs, name, Validator, ...a));
