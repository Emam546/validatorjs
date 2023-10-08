/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { InputRules, Rules } from "@/type";
import { isValidInput, is_Rule } from "./utils/isRule";
import { isString } from "./utils/types";
import { ObjectEntries } from "./utils";

export function parseRules<T extends InputRules, G extends string = "">(
    input: T,
    pre?: G
): T extends infer R ? Rules<R, G> : never {
    const _parseRules: any = parseRules;
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
