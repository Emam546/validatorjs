"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.message = void 0;
exports.message = {
    en: (value, name, validator) => `THE RULE ${name} IS NOT EXIST`,
};
function RuleIsNotExist(...arr) {
    const [obj, _, validator, ...arr2] = arr;
    const val = exports.message[validator.lang];
    if (val)
        if (typeof val == "string")
            return val;
        else
            val(obj, "Not matched error", validator, ...arr2);
    throw new Error("this language is not in not matching messages");
}
exports.default = RuleIsNotExist;
