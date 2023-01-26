"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setValue = exports.setAllValues = void 0;
function setAllValues(inputs, path, value) {
    if (!path.length)
        return [false];
    const keys = path.split(".");
    let currObj = inputs;
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (key.startsWith("*")) {
            const returnedPath = keys.slice(i + 1).join(".");
            let allValues = [];
            for (const key in currObj)
                allValues = [
                    ...allValues,
                    ...setAllValues(currObj[key], returnedPath, value),
                ];
            return allValues;
        }
        else
            currObj = currObj[key];
        if (currObj === undefined)
            return [false];
    }
    const key = keys.at(-1);
    if (key === undefined)
        return [false];
    if (key.startsWith("*")) {
        for (const key in currObj)
            currObj[key] = value;
    }
    else
        currObj[key] = value;
    return [true];
}
exports.setAllValues = setAllValues;
function setValue(inputs, path, value) {
    const keys = path.split(".");
    let currObj = inputs;
    for (let i = 0; i < keys.length - 1 && currObj != undefined; i++) {
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
    if (currObj === undefined)
        return false;
    const key = keys.at(-1);
    if (key === undefined)
        return false;
    if (key.startsWith("*")) {
        const index = parseInt(key.slice(1));
        if (isNaN(index))
            return false;
        currObj[index] = value;
    }
    else
        currObj[key] = value;
    return true;
}
exports.setValue = setValue;
