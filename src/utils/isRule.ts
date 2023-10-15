import { objectValues } from ".";
import { isArray, isString } from "./types";
import Validator from "@/main";
export type ValidArray<T = unknown> =
    | [T]
    | [T, "object" | "array"]
    | [
          T,
          "object" | "array",
          (
              | ({
                    [name: string | number]: T;
                } & { "."?: RulesGetter })
              | RulesGetter
          )
      ];
export function isValidInput<T>(array: unknown): array is ValidArray<T> {
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
