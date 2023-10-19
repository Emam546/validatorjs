/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { InputRules, PathRules } from "@/type";
import { isValidInput, is_Rule } from "@/utils/isRule";
import { isObject, isString } from "@/utils/types";
import { ObjectEntries, objectValues } from "@/utils";

export function extractRulesPaths<T, G extends string = "">(
    input: T,
    pre?: G
): PathRules<T, G> {
    const _parseRules: any = extractRulesPaths;
    return ((input: any, pre?: string): any => {
        if (is_Rule(input)) return { [pre ? pre : "."]: input };
        if (isValidInput(input)) {
            const t = input[1] || "array";
            return {
                ..._parseRules(input[0], pre ? `${pre}.*:${t}` : `*:${t}`),
                ...(input[2] != undefined
                    ? _parseRules(input[2], pre ? pre : ".")
                    : {}),
            };
        }
        if (isString(input)) {
            const arr = input.split("|");
            if (is_Rule(arr)) return { [pre ? pre : "."]: arr };
            throw new Error("unrecognized string");
        }
        return ObjectEntries(input).reduce(
            (acc, [path, val]) => ({
                ...acc,
                ..._parseRules(
                    val,
                    pre ? (path == "." ? pre : `${pre}.${path}`) : path
                ),
            }),
            {}
        );
    })(input, pre);
}
export function checkRules(input: unknown): input is InputRules {
    if (is_Rule(input)) return true;
    if (isValidInput(input)) {
        const t = input[1] || "array";
        return (
            checkRules(input[0]) &&
            ["array", "object"].includes(t) &&
            (!input[2] || checkRules(input[2]))
        );
    }
    if (isString(input)) {
        const arr = input.split("|");
        return is_Rule(arr);
    }
    return (
        isObject(input) && objectValues(input).every((val) => checkRules(val))
    );
}
