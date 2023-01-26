import { Rules } from "..";
import { isArray } from "./types";

function constructRule(rule: string, input?: any): Object | null {
    if (!rule) return null;
    let currObj = input || {};
    const paths = rule.split(".");
    const path = paths[0] || ".";
    const lastPath = paths.slice(1).join(".");
    if (path.startsWith("*")) {
        let [, _type]: Array<any> = path.split(":");
        currObj = [constructRule(lastPath, currObj[0]), _type];
    } else {
        if (currObj instanceof Array) currObj = { "*:array": currObj };
        if (currObj[path] !== undefined) {
            if (isArray(currObj[path]) && !lastPath)
                currObj[path].push(constructRule(lastPath, currObj[path]));
            else if (lastPath)
                currObj[path] = constructRule(lastPath, currObj[path]);
        } else currObj[path] = constructRule(lastPath, currObj[path]);
    }
    return currObj;
}
export default function (rules: Rules): Object | null {
    let newObj: Object | null = {};
    for (const rule in rules) newObj = constructRule(rule, newObj);
    return newObj;
}
