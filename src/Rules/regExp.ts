import Rule, { RuleFun } from "@/Rule";
import handelMessage from "@/utils/handelMessage";
import ValueNOTtheSame from "./Messages/ValuesNotSame";
import { isString } from "@/utils/types";
import { hasOwnProperty } from "@/utils/compare";

export default new Rule<{ regex: RegExp }>(
    (val: unknown): val is { regex: RegExp } => {
        return hasOwnProperty(val, "regex") && val.regex instanceof RegExp;
    },
    function regExp(...arr) {
        const [value, data, , lang] = arr;
        if (!isString(value))
            return handelMessage(ValueNOTtheSame[lang], ...arr);
        const res = data.regex.test(value);
        if (!res) return handelMessage(ValueNOTtheSame[lang], ...arr);
    }
);
