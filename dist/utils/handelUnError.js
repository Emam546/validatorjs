"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(mess, ...arr) {
    if (mess != undefined)
        if (typeof mess == "function")
            return mess(...arr);
        else
            return mess;
}
exports.default = default_1;
