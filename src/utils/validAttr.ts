import { Rules } from "../parseRules";
import constructObj from "./constructObj";
import { isArray, isObject } from "./types";
function matchObjs(input: unknown, matchObj: unknown): unknown {
    if (matchObj === null) return input;
    if (input === undefined) return input;

    if (isArray<string>(matchObj)) {
        const [, _type] = matchObj;
        const newObj: Array<unknown> | Record<string, unknown> =
            _type == "array" ? [] : {};

        if (_type == "array" && !isArray(input)) return [];
        if (isArray(input) && isArray(newObj))
            for (let i = 0; i < input.length; i++)
                newObj[i] = matchObjs(input[i], matchObj[0]);
        else if (isObject(input) && isObject(newObj))
            for (const key in input)
                newObj[key] = matchObjs(input[key], matchObj[0]);

        return newObj;
    } else if (isObject(input) && isObject(matchObj)) {
        const newObj: Record<string, unknown> = {};
        for (const key in matchObj) {
            if (input[key] !== undefined)
                newObj[key] = matchObjs(input[key], matchObj[key]);
        }
        return newObj;
    }
}

export default function <T>(input: unknown, rules: Rules<T>): unknown {
    const RulesObj = constructObj(rules);
    return matchObjs(input, RulesObj);
}
