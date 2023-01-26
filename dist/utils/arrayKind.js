"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TYPE_ARRAY = void 0;
exports.TYPE_ARRAY = ["object", "array"];
function arrayKind(array) {
    //get string rule of the  array rule
    //for example [{name:"ali"},"array",1,3]->*:array:1:3
    let [, type_] = array;
    let prop = "";
    if (exports.TYPE_ARRAY.includes(type_)) {
        prop += ":" + type_;
    }
    else
        prop += ":array";
    return prop;
}
exports.default = arrayKind;
