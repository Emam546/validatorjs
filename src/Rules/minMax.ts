
import Rule, {  RuleFun, StoredMessage } from "../Rule";
import LangTypes from "../types/lang";
import handelUndefined from "../utils/handelUndefined";
import handelUnError from "../utils/handelUnError";
import { isArray, isNumber, isObject, isString } from "../utils/types";
import { MinError, MaXError } from "./Messages/minMax";
import UnKnownInputValue from "./Messages/unKnownValue";
import UnKnownRuleValue from "./Messages/UnknownRule";

function getNumber(value: any, lang: LangTypes): number | StoredMessage {
    if (isNumber(value)) return value;
    if (isArray(value) || isString(value)) return value.length as number;
    if (value instanceof Set || value instanceof Map) return value.size;
    if (isObject(value)) return Object.keys(value).length;
    const val = UnKnownInputValue[lang];
    return handelUndefined(val)
}
function minFun(
    value: number,
    min: number,
    lang: LangTypes
): StoredMessage | undefined {
    min = isNaN(min) ? 0 : min;
    if (value < min) return handelUndefined(MinError[lang]);
}
function maxFun(
    value: number,
    max: number,
    lang: LangTypes
): StoredMessage | undefined {
    if (isNaN(max)) return handelUndefined(UnKnownRuleValue[lang]);
    if (value > max) return handelUndefined(MaXError[lang]);
}
function MinHandler(
    ...[value,name,,,lang]:Parameters<RuleFun>
): StoredMessage | undefined {
    let min = parseFloat(name.split(":")[1]) || 0;
    const val = getNumber(value, lang);
    if (isNumber(val) && typeof val == "number")
        return minFun(val, min, lang);
    if (typeof val != "number") return val;
}
function MaxHandler(
    ...[value,name,,,lang]:Parameters<RuleFun>
): StoredMessage | undefined {
    let max = parseFloat(name.split(":")[1]);
    const val = getNumber(value, lang);
    if (isNumber(val) && typeof val == "number")
        return maxFun(val, max, lang);
    if (typeof val != "number") return val;
}
function limit(
    ...[value,name,,,lang]:Parameters<RuleFun>
): StoredMessage | undefined {
    let [, min, max]: number[] = name.split(":").map((e) => parseFloat(e));
    const val = getNumber(value, lang);
    if (typeof val == "number") {
        const minMess = minFun(val, min, lang);
        if (minMess == undefined) {
            const maxMess = maxFun(val, max, lang);
            if (maxMess != undefined) return maxMess;
        }
        return minMess;
    } else return val;
}

export const min = new Rule(
    /^min(:\d+)?$/g,
    (...arr) => {
        return handelUnError(MinHandler(...arr),...arr);
    },

);
export const max = new Rule(
    /^max:\d+$/g,
    (...arr) => {
        return handelUnError(MaxHandler(...arr),...arr);
    },
);

export default new Rule(
    /^limit:\d+:\d+$/,
    (...arr) => {
        return handelUnError(limit(...arr),...arr);
    },

);
