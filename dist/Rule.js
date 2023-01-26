"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./utils/types");
class Rule {
    constructor(name, fn, initFn) {
        this.name = name;
        this.fn = fn;
        this.initFn = initFn;
    }
    isequal(value) {
        if ((0, types_1.isString)(this.name) && this.name == value)
            return true;
        else if (this.name instanceof RegExp)
            return value.match(this.name) != null;
        return false;
    }
    validate(value, name, validator, path, lang) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.fn(value, name, validator, path, lang);
        });
    }
    initSubmit(validator, lang) {
        return __awaiter(this, void 0, void 0, function* () {
            const { CRules: rules } = validator;
            let returnedErrors = {};
            if (!this.initFn)
                return {};
            for (const path in rules) {
                const arr = rules[path];
                if (arr)
                    for (let i = 0; i < arr.length; i++) {
                        if (this.isequal(arr[i])) {
                            const message = yield this.initFn(arr[i], validator, path, lang);
                            if (message != undefined)
                                returnedErrors = Object.assign(Object.assign({}, returnedErrors), message);
                        }
                    }
            }
            return returnedErrors;
        });
    }
}
exports.default = Rule;
