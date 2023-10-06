/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { InputRules, Rules } from "@/type";
import arrayKind from "./utils/arrayKind";
import { hasOwnProperty } from "./utils/compare";
import { isValidInput, is_Rule } from "./utils/isRule";
import { isArray } from "./utils/types";
//
export function parseRules<T>(
    input: T
): Rules<T> {
    //just parse rules from the object
    //it must alway finishes with
    // - array of string  that describes rules
    // - string that split with | sign
    const flattened: any = {};
    const _get_rule = (rules: unknown, property?: string) => {
        if (isArray(rules)) {
            // if there is added property before add .
            const p = property ? property + ".*" : "*";
            if (rules.length) {
                //get the type of the array
                // - array of rules
                // - array that describes a rules of the object or array
                if (is_Rule(rules))
                    //check if it is array that describes some rule
                    flattened[property || "."] = rules;
                else if (isValidInput(rules)) {
                    //get array rules and continue in parsing object
                    _get_rule(rules[0], p + arrayKind(rules));
                    if (rules[2] && isArray(rules)) {
                        _get_rule(rules[2], property);
                    }
                } else if (isArray(rules))
                    throw new Error(
                        `${rules.toString()} is not a valid rule input`
                    );
            } else flattened[p] = null;
        } else if (rules != undefined) {
            for (const prop in rules) {
                if (!hasOwnProperty(rules, prop)) continue;
                const rule = rules[prop];
                let p;
                if (prop == ".") p = property ? property : prop;
                else p = property ? property + "." + prop : prop;

                switch (typeof rule) {
                    case "string": {
                        const res = rule.split("|");
                        if (is_Rule(res)) flattened[p] = res;
                        break;
                    }
                    case "object":
                        if (rule === null) flattened[p] = rule;
                        else _get_rule(rule, p);
                }
            }
        }
    };
    _get_rule(input);
    return flattened;
}
parseRules({ name: "str" });
