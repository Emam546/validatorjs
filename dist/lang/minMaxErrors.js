"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaXErrors = exports.MinErrors = void 0;
exports.MinErrors = {
    en: "YOU DIDN'T REACH THE MINIMUM LIMIT OF ARRAY",
};
exports.MaXErrors = {
    en: "YOU REACHED THE MAXIMUM LIMIT OF ARRAY",
};
function _arrayRange(min, max, ...[obj, , validator, ...arr]) {
    let length = obj instanceof Array ? obj.length : Object.keys(obj).length;
    let minError, maxError;
    if (!(minError = exports.MinErrors[validator.lang]) ||
        !(maxError = exports.MaXErrors[validator.lang]))
        throw new Error("You must provide a min max message for this language");
    if (min > length)
        if (typeof minError == "string")
            return minError;
        else
            return minError(obj, "minError", validator, ...arr);
    else if (max < length)
        if (typeof maxError == "string")
            return maxError;
        else
            return maxError(obj, "maxError", validator, ...arr);
}
exports.default = _arrayRange;
