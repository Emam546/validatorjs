"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getValue = exports.getAllValues = void 0;
const types_1 = require("./types");
function getAllValues(inputs, path, addedPath = "") {
    if (!path.length)
        return { [addedPath.slice(0, -1)]: inputs };
    const paths = path.split(".");
    let currObj = inputs;
    for (let i = 0; i < paths.length; i++) {
        const key = paths[i];
        if (key.startsWith("*")) {
            const oldPath = paths.slice(0, i).join(".");
            const returnedPath = paths.slice(i + 1).join(".");
            let allValues = {};
            const semi = (0, types_1.isArray)(currObj) ? "*" : "";
            for (const key in currObj)
                allValues = Object.assign(Object.assign({}, allValues), getAllValues(currObj[key], returnedPath, `${addedPath}${oldPath}.${semi}${key}.`));
            return allValues;
        }
        else
            currObj = currObj[key];
        if (currObj === undefined)
            return {};
    }
    return { [`${addedPath}${path}`]: currObj };
}
exports.getAllValues = getAllValues;
function getValue(inputs, path) {
    const keys = path.split(".");
    let currObj = inputs;
    for (let i = 0; i < keys.length && currObj != undefined; i++) {
        const key = keys[i];
        if (key.startsWith("*")) {
            const index = parseInt(key.slice(1));
            if (!isNaN(index)) {
                currObj = currObj[index];
                if (currObj != undefined)
                    continue;
            }
        }
        else
            currObj = currObj[key];
    }
    return currObj;
}
exports.getValue = getValue;
