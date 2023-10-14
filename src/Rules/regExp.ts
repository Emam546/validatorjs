import Rule from "@/Rule";
import handelMessage from "@/utils/handelMessage";
import Messages from "./Messages/ValuesNotSame";
export { default as Messages } from "./Messages/ValuesNotSame";
import { isString } from "@/utils/types";
import { hasOwnProperty } from "@/utils/compare";

export default new Rule<{ regExp: RegExp }, typeof Messages, string>(
    (val: unknown): val is { regExp: RegExp } => {
        return hasOwnProperty(val, "regExp") && val.regExp instanceof RegExp;
    },
    function regExp(value, data, path, input, lang, errors) {
        if (!isString(value))
            return handelMessage(errors[lang], value, data, path, input, lang);
        const res = data.regExp.test(value);
        if (!res)
            return handelMessage(errors[lang], value, data, path, input, lang);
    },
    Messages
);
