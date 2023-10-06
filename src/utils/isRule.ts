import Rule from "@/Rule";
import { isArray, isString } from "./types";
export type ValidArray<T = unknown> =
    | [T]
    | [T, "object" | "array"]
    | [T, "object" | "array", T];
export function isValidInput(array: unknown): array is ValidArray {
    return isArray<string>(array) && array.length > 0 && array.length <= 3;
}
export type RulesNames = {
    [K in keyof Validator.AvailableRules]: Validator.AvailableRules[K] extends Rule<
        infer Name
    >
        ? Name extends string
            ? Name
            : never
        : never;
}[keyof Validator.AvailableRules];
export type RulesGetter = Array<RulesNames> | null;
const v: RulesGetter = ["accepted"];

export function is_Rule(array: unknown): array is RulesGetter {
    return (
        isArray(array) &&
        array instanceof Array &&
        !array.some((v) => {
            return !isString(v);
        })
    );
}
