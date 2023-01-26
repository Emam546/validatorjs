"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.message = void 0;
exports.message = {
    en: "the inserted data type is not matching with the object type",
};
function UnMatchedType(obj, validator, path) {
    const val = exports.message[validator.lang];
    if (val)
        if (typeof val == "string")
            return val;
        else
            val(obj, "Not matched error", validator, path);
    throw new Error("this language is not in not matching messages");
}
exports.default = UnMatchedType;
