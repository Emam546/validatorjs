/* eslint-disable @typescript-eslint/no-var-requires */
import { isArray, isString } from "./types";
import Validator from "@/main";
export type ValidArray<T = unknown> =
    | [T]
    | [T, "object" | "array"]
    | [T, "object" | "array", T];
export function isValidInput(array: unknown): array is ValidArray {
    return (
        isArray(array) &&
        array.length > 0 &&
        array.length <= 3 &&
        (typeof array[1] == "undefined" ||
            (isString(array[1]) && ["object", "array"].includes(array[1])))
    );
}

export type RulesNames = {
    [K in keyof Validator.AvailableRules]: Validator.AvailableRules[K]["path"];
}[keyof Validator.AvailableRules];
export type RulesGetter = Array<RulesNames> | null;

export function is_Rule(val: unknown): val is RulesGetter {
    if (Validator.Rules.length == 0)
        throw new Error("there is no rules defined");
    return (
        (isArray(val) &&
            val.every((g) => {
                return Validator.Rules.some((rule) => rule.isequal(g));
            })) ||
        val == null
    );
}
