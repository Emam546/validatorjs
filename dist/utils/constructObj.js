"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
function constructRule(rule, input) {
    if (!rule)
        return null;
    let currObj = input || {};
    const paths = rule.split(".");
    const path = paths[0] || ".";
    const lastPath = paths.slice(1).join(".");
    if (path.startsWith("*")) {
        let [, _type] = path.split(":");
        currObj = [constructRule(lastPath, currObj[0]), _type];
    }
    else {
        if (currObj instanceof Array)
            currObj = { "*:array": currObj };
        if (currObj[path] !== undefined) {
            if ((0, types_1.isArray)(currObj[path]) && !lastPath)
                currObj[path].push(constructRule(lastPath, currObj[path]));
            else if (lastPath)
                currObj[path] = constructRule(lastPath, currObj[path]);
        }
        else
            currObj[path] = constructRule(lastPath, currObj[path]);
    }
    return currObj;
}
function default_1(rules) {
    let newObj = {};
    for (const rule in rules)
        newObj = constructRule(rule, newObj);
    return newObj;
}
exports.default = default_1;
