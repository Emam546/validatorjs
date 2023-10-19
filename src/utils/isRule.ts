import { objectValues } from ".";
import { ValidArray, RulesGetter } from "@/type";
import { isArray, isString } from "./types";
import * as Validator from "@/index";

export function isValidInput<T>(array: unknown): array is ValidArray<T> {
    return (
        isArray(array) &&
        array.length > 0 &&
        array.length <= 3 &&
        (typeof array[1] == "undefined" ||
            (isString(array[1]) && ["object", "array"].includes(array[1])))
    );
}

export function is_Rule(val: unknown): val is RulesGetter {
    return (
        (isArray(val) &&
            val.every((g) => {
                return objectValues(Validator.Rules).some((rule) =>
                    rule.isequal(g)
                );
            })) ||
        val == null
    );
}
