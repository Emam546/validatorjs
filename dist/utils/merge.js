"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
function filterObj(obj) {
    return (!((0, types_1.isString)(obj) &&
        (0, types_1.isNumber)(obj) &&
        typeof obj == "boolean" &&
        typeof obj == "undefined") && obj instanceof Object);
}
function mergeObjects(...objs) {
    objs = objs.filter((obj) => obj != undefined);
    if (!objs.length)
        return;
    const newObjs = objs.filter(filterObj);
    if (!newObjs.length)
        return objs.at(-1);
    objs = newObjs;
    if (objs.length == 1)
        return objs[0];
    const allKeys = objs.reduce((acc, cObj) => {
        return Object.assign(Object.assign({}, acc), cObj);
    });
    for (const objKey in allKeys) {
        if (Object.prototype.hasOwnProperty.call(allKeys, objKey)) {
            const element = allKeys[objKey];
            if (element instanceof Array) {
                const maxLength = objs.reduce((acc, v) => acc + v.length, 0);
                for (let i = 0; i < maxLength; i++)
                    allKeys[objKey][i] = mergeObjects(...objs.map((obj) => obj[i]));
            }
            else
                allKeys[objKey] = mergeObjects(...objs.map((obj) => obj[objKey]));
        }
    }
    return allKeys;
}
exports.default = mergeObjects;
