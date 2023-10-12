import {
    InputRules,
    RulesGetter,
    ValidArray,
    isValidInput,
    is_Rule,
} from "@/type";
import { ObjectEntries } from "@/utils";
import { isString } from "./types";
export type ExtractedRules<T> = T extends Record<string | number, InputRules>
    ? {
          [K in keyof T]: ExtractedRules<T[K]>;
      }
    : T extends RulesGetter
    ? null
    : T extends string
    ? null
    : T extends ValidArray<InputRules>
    ? [ExtractedRules<T[0]>, T[1], ExtractedRules<T[2]>]
    : null;
type ExtractedInputRules =
    | null
    | {
          [name: string]: ExtractedInputRules;
      }
    | [ExtractedInputRules]
    | [ExtractedInputRules, "object" | "array"]
    | [ExtractedInputRules, "object" | "array", ExtractedInputRules];
function constructRule(rules: InputRules): ExtractedInputRules {
    if (is_Rule(rules) || isString(rules)) return null;

    if (isValidInput(rules)) {
        const [rule1, _type, rule2] = rules;
        return [
            constructRule(rule1),
            _type || "array",
            rule2 ? constructRule(rule2) : null,
        ];
    }

    return ObjectEntries(rules).reduce((acc, [key, val]) => {
        if (key == ".") return acc;
        return {
            ...acc,
            [key]: constructRule(val),
        };
    }, {});
}
export default function <T extends InputRules>(rules: T): ExtractedRules<T> {
    return constructRule(rules) as ExtractedRules<T>;
}
