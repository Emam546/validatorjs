/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Rules } from "..";
import { _Error } from "@/Rule";
import constructObj from "./constructObj";
import { isArray } from "./types";
export type ReturnTypeUnMatch = Record<string, _Error> | null;
export function unMatchedValues(
    input: any,
    unMatchObj: any,
    addedPath = ""
): ReturnTypeUnMatch {
    if (input == undefined) return null;
    if (typeof unMatchObj == "undefined")
        return { [addedPath]: { message: "invalid path", value: input } };
    if (unMatchObj == null) return null;
    let errors: Record<string, _Error> = {};
    if (isArray<string>(unMatchObj)) {
        const [, _type] = unMatchObj;
        if (_type == "array" && !isArray(input))
            return {
                [addedPath]: { message: "Unmatched type value", value: input },
            };

        if (unMatchObj[0])
            for (const key in input)
                errors = {
                    ...errors,
                    ...unMatchedValues(
                        input[key],
                        unMatchObj[0],
                        `${addedPath}*${key}.`
                    ),
                };
    } else {
        for (const key in input)
            errors = {
                ...errors,
                ...unMatchedValues(
                    input[key],
                    unMatchObj[key],
                    `${addedPath}${key}.`
                ),
            };
    }

    if (Object.values(errors).length == 0) return null;
    return errors;
}
export default function (input: unknown, rules: Rules): ReturnTypeUnMatch {
    const RulesObj = constructObj(rules);
    return unMatchedValues(input, RulesObj);
}
