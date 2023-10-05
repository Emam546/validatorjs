/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { InputRules, Rules } from "../parseRules";
import { hasOwnProperty } from "./compare";
import { isArray } from "./types";

function constructRule(
    rule: string,
    input?: unknown
): Record<string, unknown> | null {
    if (!rule) return null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let currObj: any = input || {};
    const paths = rule.split(".");
    const path = paths[0] || ".";
    const lastPath = paths.slice(1).join(".");
    if (path.startsWith("*")) {
        const [, _type]: Array<string> = path.split(":");
        if (hasOwnProperty(currObj, 0))
            currObj = [constructRule(lastPath, currObj[0]), _type];
        else if (isArray(currObj))
            currObj = [constructRule(lastPath, currObj[0]), _type];
        else currObj = [constructRule(lastPath, undefined), _type];
    } else {
        if (currObj instanceof Array) currObj = { "*:array": currObj };
        if (hasOwnProperty(currObj, path)) {
            const arr = currObj[path];
            if (isArray(arr) && !lastPath)
                arr.push(constructRule(lastPath, currObj[path]));
            else if (lastPath)
                currObj[path] = constructRule(lastPath, currObj[path]);
            // eslint-disable-next-line  @typescript-eslint/no-unsafe-member-access
        } else currObj[path] = constructRule(lastPath, currObj[path]);
    }
    return currObj;
}
export default function <T>(
    rules:  Rules<T> 
): Record<string, unknown> | null {
    let newObj: Record<string, unknown> | null = {};
    for (const rule in rules) newObj = constructRule(rule, newObj);
    return newObj;
}
