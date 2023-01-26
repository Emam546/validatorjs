"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidatorClass = exports.parseRules = exports.TYPE_ARRAY = void 0;
const types_1 = require("./utils/types");
const Rule_1 = __importDefault(require("./Rule"));
const r = __importStar(require("./Rules"));
const notMatch_1 = __importDefault(require("./lang/notMatch"));
const isRule_1 = require("./utils/isRule");
const arrayKind_1 = __importDefault(require("./utils/arrayKind"));
const getValue_1 = require("./utils/getValue");
const validAttr_1 = __importDefault(require("./utils/validAttr"));
const compare_1 = __importDefault(require("./utils/compare"));
const inValidAttr_1 = __importDefault(require("./utils/inValidAttr"));
const isEmpty_1 = __importDefault(require("./utils/isEmpty"));
const setValue_1 = require("./utils/setValue");
exports.TYPE_ARRAY = ["object", "array"];
function parseRules(input) {
    //just parse rules from the object
    //it must alway finishes with
    // - array of string  that describes rules
    // - string that split with | sign
    const flattened = {};
    const _get_rule = (rules, property) => {
        if ((0, types_1.isArray)(rules)) {
            // if there is added property before add .
            const p = property ? property + ".*" : "*";
            if (rules.length) {
                //get the type of the array
                // - array of rules
                // - array that describes a rules of the object or array
                if ((0, isRule_1.is_Rule)(rules))
                    //check if it is array that describes some rule
                    flattened[property || "."] = rules;
                else if (rules.length && rules.length <= 3) {
                    //get array rules and continue in parsing object
                    _get_rule(rules[0], p + (0, arrayKind_1.default)(rules));
                    if (rules[2] && (0, types_1.isArray)(rules)) {
                        _get_rule(rules[2], property);
                    }
                }
                else
                    throw new Error(`${rules} is not a valid rule input`);
            }
            else
                flattened[p] = null;
        }
        else {
            for (const prop in rules) {
                if (!Object.prototype.hasOwnProperty.call(rules, prop))
                    continue;
                const rule = rules[prop];
                let p;
                if (prop == ".")
                    p = property ? property : prop;
                else
                    p = (property ? property + "." + prop : prop);
                switch (typeof rule) {
                    case "string":
                        flattened[p] = rule.split("|");
                        break;
                    case "object":
                        if (rule === null)
                            flattened[p] = rule;
                        else
                            _get_rule(rule, p);
                }
            }
        }
    };
    _get_rule(input);
    return flattened;
}
exports.parseRules = parseRules;
class ValidatorClass {
    constructor(inputs, rules, reqData, options) {
        this.errors = {};
        this.inValidErrors = null;
        this.lang = "en";
        this.inputs = inputs;
        this.CRules = rules;
        this.options = options || {};
        this.reqData = reqData;
        this.empty = (0, isEmpty_1.default)(inputs);
        if (options)
            this.lang = options.lang || this.lang;
    }
    passes() {
        return __awaiter(this, void 0, void 0, function* () {
            //Just object of paths and there current objects
            return (yield this.getErrors()) === null;
        });
    }
    getErrors() {
        return __awaiter(this, void 0, void 0, function* () {
            //Just object of paths and Errors description
            let Errors = {};
            for (const path in this.CRules) {
                const r = yield this._get_errors(this.inputs, path, this.CRules[path]);
                // result = { ...result, ...r[0] };
                Errors = Object.assign(Object.assign({}, Errors), r);
            }
            this.errors = Errors;
            if (Object.keys(Errors).length == 0)
                return null;
            return Errors;
        });
    }
    fails() {
        return __awaiter(this, void 0, void 0, function* () {
            return !(yield this.passes());
        });
    }
    _getSubmitErrors() {
        return __awaiter(this, void 0, void 0, function* () {
            let Result = {};
            for (let i = 0; i < ValidatorClass.Rules.length; i++) {
                const res = yield ValidatorClass.Rules[i].initSubmit(this, this.lang);
                Result = Object.assign(Object.assign({}, Result), res);
            }
            return Result;
        });
    }
    _get_errors(inputs, path, rule, addedPath = "") {
        return __awaiter(this, void 0, void 0, function* () {
            const paths = path.split(".");
            let currentObj = inputs;
            // let result: Record<string, any> = {};
            let Errors = yield this._getSubmitErrors();
            for (let i = 0; i < paths.length; i++) {
                if (paths[i].indexOf("*") == 0) {
                    let currPath = addedPath + paths.slice(0, i).join(".");
                    let [, type_] = paths[i].split(":");
                    const oldPath = paths.slice(0, i).join(".");
                    const newPath = paths.slice(i + 1).join(".");
                    if (type_ == "array" && (0, types_1.isArray)(currentObj)) {
                        for (let i = 0; i < currentObj.length; i++) {
                            const r = yield this._get_errors(currentObj[i], newPath, rule, `${addedPath}${oldPath}.*${i}${newPath ? "." : ""}`);
                            Errors = Object.assign(Object.assign({}, Errors), r);
                        }
                    }
                    else if (type_ == "object" &&
                        (0, types_1.isObject)(currentObj)) {
                        for (const key in currentObj) {
                            const r = yield this._get_errors(currentObj[key], newPath, rule, `${addedPath}${oldPath}.${key}${newPath ? "." : ""}`);
                            Errors = Object.assign(Object.assign({}, Errors), r);
                        }
                    }
                    else {
                        Errors[addedPath + paths.slice(0, i).join(".")] = [
                            {
                                message: (0, notMatch_1.default)(currentObj, this, currPath),
                                value: currentObj,
                            },
                        ];
                        break;
                    }
                    //make _get_errors do the rest of work and break the loop
                    break;
                }
                else if ((0, types_1.isObject)(currentObj)) {
                    if (!Object.prototype.hasOwnProperty.call(currentObj, paths[i]))
                        break;
                    currentObj = currentObj[paths[i]];
                }
                else if (i !== paths.length - 1)
                    Errors[addedPath + paths.slice(0, i).join(".")] = [
                        {
                            value: currentObj,
                            message: "the current value is not a object",
                        },
                    ];
                if (i === paths.length - 1) {
                    if (rule) {
                        for (let i = 0; i < rule.length; i++) {
                            const result = yield this.validate(currentObj, //value
                            rule[i], addedPath + path);
                            if (result.length)
                                if (!Errors[addedPath + path])
                                    Errors[addedPath + path] = result;
                                else
                                    Errors[addedPath + path].push(...result);
                        }
                    }
                }
            }
            return Errors;
        });
    }
    getValue(path) {
        return (0, getValue_1.getValue)(this.inputs, path);
    }
    setValue(path, value) {
        return (0, setValue_1.setValue)(this.inputs, path, value);
    }
    getAllValues(path) {
        return (0, getValue_1.getAllValues)(this.inputs, path);
    }
    setAllValues(path, value) {
        return (0, setValue_1.setAllValues)(this.inputs, path, value);
    }
    validAttr() {
        return (0, validAttr_1.default)(this.inputs, this.CRules);
    }
    inValidAttr() {
        return (this.inValidErrors = (0, inValidAttr_1.default)(this.inputs, this.CRules));
    }
    inside() {
        return (0, compare_1.default)(this.validAttr(), this.inputs);
    }
    validate(value, rule, path, expect) {
        return __awaiter(this, void 0, void 0, function* () {
            let has = false;
            const arrMess = [];
            for (let i = 0; i < ValidatorClass.Rules.length; i++) {
                const ele = ValidatorClass.Rules[i];
                if (ele.isequal(rule) &&
                    !(expect && !expect.some((rul) => ele.isequal(rul)))) {
                    has = true;
                    const message = yield ele.validate(value, rule, this, path, this.lang);
                    if (message)
                        arrMess.push({
                            value,
                            message,
                        });
                }
            }
            if (!has)
                throw new Error(`THE RULE ${rule} IS NOT EXIST`);
            return arrMess;
        });
    }
    static register(name, fun, initSubmit) {
        const rule = new Rule_1.default(name, fun, initSubmit);
        ValidatorClass.Rules.push(rule);
        return rule;
    }
}
exports.ValidatorClass = ValidatorClass;
ValidatorClass.parseRules = parseRules;
class S extends ValidatorClass {
    constructor(inputs, rules, reqData, options) {
        super(inputs, rules, reqData, options);
    }
}
exports.default = S;
ValidatorClass.Rules = Object.values(Object.assign({}, r));
