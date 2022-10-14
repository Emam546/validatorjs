import { Rules } from "../main";

function constructRule(rule: string, input?: any): Object | null {
    if (!rule) return null;
    let currObj = input || {};
    const paths = rule.split(".");
    const path = paths[0];
    const lastPath = paths.slice(1).join(".");
    if (path.startsWith("*")) {
        const _type = path.split(":")[1];
        currObj = [constructRule(lastPath, currObj[0]), _type];
    } else currObj[path] = constructRule(lastPath, currObj[path]);
    return currObj;
}
export default function (rules: Rules): Object | null {
    let newObj: Object | null = {};
    for (const rule in rules) newObj = constructRule(rule, newObj);

    return newObj;
}
