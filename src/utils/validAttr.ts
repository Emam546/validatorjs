import { ValidTypes } from "@/type";
import constructObj, { ExtractedRules } from "./constructObj";
import { isArray, isObject } from "./types";
import { ObjectEntries } from ".";
import { hasOwnProperty } from "./compare";
function matchObjs<T>(input: unknown, matchObj: ExtractedRules<T>): unknown {
    if (matchObj === null) return input;

    if (isArray(matchObj)) {
        const _type = matchObj[1] || "array";
        const rule2 = matchObj[2] || {};
        if (_type == "array") {
            if (!isArray(input)) return [];
            return input.map((val, i) => {
                if (hasOwnProperty(rule2, i))
                    return matchObjs(val, {
                        ...(matchObj[0] ? matchObj[0] : {}),
                        ...((rule2[i] ? rule2[i] : {}) as ExtractedRules<T>),
                    } as ExtractedRules<T>);
                return matchObjs(val, matchObj[0] as ExtractedRules<T>);
            });
        }
        if (!isObject(input)) return {};
        return ObjectEntries(input).reduce((acc, [key, val]) => {
            if (hasOwnProperty(rule2, key))
                return {
                    ...acc,
                    [key]: matchObjs(val, {
                        ...(matchObj[0] ? matchObj[0] : {}),
                        ...((rule2[key]
                            ? rule2[key]
                            : {}) as ExtractedRules<T>),
                    } as ExtractedRules<T>),
                };
            return {
                ...acc,
                [key]: matchObjs(val, matchObj[0] as ExtractedRules<T>),
            };
        }, {});
    }
    if (!isObject(input)) return {};
    return ObjectEntries(matchObj).reduce((acc, [key, rule]) => {
        if (!hasOwnProperty(input, key)) return acc;
        return {
            ...acc,
            [key]: matchObjs(input[key], rule as ExtractedRules<T>),
        };
    }, {});
}

export default function <T>(input: unknown, rules: T): ValidTypes<T> {
    const RulesObj = constructObj(rules);
    return matchObjs(input, RulesObj) as ValidTypes<T>;
}
