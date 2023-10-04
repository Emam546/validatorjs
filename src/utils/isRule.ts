import { RulesGetter } from "@/Rules";
import { isArray, isString } from "./types";
export type ValidArray<T = unknown> =
    | [T]
    | [T, "object" | "array"]
    | [T, "object" | "array", RulesGetter];
export function isValidInput(array: Array<unknown>): array is ValidArray {
    return isArray<string>(array) && array.length > 0 && array.length <= 3;
}
export function is_Rule(array: unknown): array is RulesGetter {
    return (
        isArray(array) &&
        array instanceof Array &&
        !array.some((v) => {
            return !isString(v);
        })
    );
}
