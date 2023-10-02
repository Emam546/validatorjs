import Rule, { RuleFun, StoredMessage } from "@/Rule";
import LangTypes from "../types/lang";
import handelUndefined from "@/utils/handelUndefined";
import handelUnError from "@/utils/handelUnError";
import { isArray, isNumber, isObject, isString } from "@/utils/types";
import { MinError, MaXError } from "./Messages/minMax";
import UnKnownInputValue from "./Messages/unKnownValue";
import UnKnownRuleValue from "./Messages/UnknownRule";

function getNumber<T>(value: T, lang: LangTypes): number | StoredMessage<T> {
    if (isNumber(value)) return value;
    if (isArray(value) || isString(value)) return value.length;
    if (value instanceof Set || value instanceof Map) return value.size;
    if (isObject(value)) return Object.keys(value).length;
    const val = UnKnownInputValue[lang];
    return handelUndefined(val);
}
function minFun(
    value: number,
    min: number,
    lang: LangTypes
): StoredMessage<number> | undefined {
    min = isNaN(min) ? 0 : min;
    if (value < min) return handelUndefined(MinError[lang]);
}
function maxFun(
    value: number,
    max: number,
    lang: LangTypes
): StoredMessage<number> | undefined {
    if (isNaN(max)) return handelUndefined(UnKnownRuleValue[lang]);
    if (value > max) return handelUndefined(MaXError[lang]);
}
function MinHandler<Data>(
    ...[value, name, , , lang]: Parameters<RuleFun<Data, number>>
): StoredMessage<number> | undefined {
    const min = parseFloat(name.split(":")[1]) || 0;
    const val = getNumber(value, lang);
    if (isNumber(val) && typeof val == "number") return minFun(val, min, lang);
    if (typeof val != "number") return val;
}
function MaxHandler<Data>(
    ...[value, name, , , lang]: Parameters<RuleFun<Data, number>>
): StoredMessage<number> | undefined {
    const max = parseFloat(name.split(":")[1]);
    const val = getNumber(value, lang);
    if (isNumber(val) && typeof val == "number") return maxFun(val, max, lang);
    if (typeof val != "number") return val;
}
function limit<Data>(
    ...[value, name, , , lang]: Parameters<RuleFun<Data, number>>
): StoredMessage<number> | undefined {
    const [, min, max] = name.split(":").map((e) => parseFloat(e));
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

export const min = new Rule<unknown, number>(/^min(:-?\d+)?$/g, (...arr) => {
    return handelUnError(MinHandler(...arr), ...arr);
});
export const max = new Rule<unknown, number>(/^max:-?\d+$/g, (...arr) => {
    return handelUnError(MaxHandler(...arr), ...arr);
});

export default new Rule<unknown, number>(/^limit:-?\d+:-?\d+$/, (...arr) => {
    return handelUnError(limit(...arr), ...arr);
});
