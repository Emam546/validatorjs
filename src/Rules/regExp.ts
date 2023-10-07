import Rule, { RuleFun } from "@/Rule";
import handelMessage from "@/utils/handelMessage";
import ValueNOTtheSame from "./Messages/ValuesNotSame";
import { isString } from "@/utils/types";
import { hasOwnProperty } from "@/utils/compare";

export default new Rule<{ regEx: RegExp }>(
    (val: unknown): val is { regEx: RegExp } => {
        return hasOwnProperty(val, "regEx") && val.regEx instanceof RegExp;
    },
    function regExp(...arr) {
        const [value, data, , lang] = arr;
        if (!isString(value))
            return handelMessage(ValueNOTtheSame[lang], ...arr);
        const res = data.regEx.test(value);
        if (!res) return handelMessage(ValueNOTtheSame[lang], ...arr);
    }
);
