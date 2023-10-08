import Rule, { StoredMessage } from "@/Rule";
import LangTypes from "../types/lang";
import handelUndefined from "@/utils/handelUndefined";
import handelUnError from "@/utils/handelUnError";
import { isArray, isNumber, isObject, isString } from "@/utils/types";
import { MinError, MaXError } from "./Messages/minMax";
import UnKnownInputValue from "./Messages/unKnownValue";
import UnKnownRuleValue from "./Messages/UnknownRule";
import { hasOwnProperty } from "@/utils/compare";

function getNumber<Data>(
    value: unknown,
    lang: LangTypes
): number | StoredMessage<Data> {
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
): StoredMessage<unknown> | undefined {
    min = isNaN(min) ? 0 : min;
    if (value < min) return handelUndefined(MinError[lang]);
}
function maxFun(
    value: number,
    max: number,
    lang: LangTypes
): StoredMessage<unknown> | undefined {
    if (isNaN(max)) return handelUndefined(UnKnownRuleValue[lang]);
    if (value > max) return handelUndefined(MaXError[lang]);
}

export const min = new Rule<{ min: number }>(
    (val: unknown): val is { min: number } => {
        return hasOwnProperty(val, "min") && isNumber(val.min);
    },
    function MinHandler(...arr) {
        const [value, data, , lang] = arr;
        const min = data.min;
        const val = getNumber<{ min: number }>(value, lang);
        if (isNumber(val))
            return handelUnError(
                handelUndefined(minFun(val, min, lang)),
                ...arr
            );
        else return handelUnError(val, ...arr);
    }
);
export const max = new Rule<{ max: number }>(
    (val: unknown): val is { max: number } => {
        return hasOwnProperty(val, "max") && isNumber(val.max);
    },
    function MaxHandler(...arr) {
        const [value, data, , lang] = arr;
        const min = data.max;
        const val = getNumber<{ max: number }>(value, lang);
        if (isNumber(val))
            return handelUnError(
                handelUndefined(maxFun(val, min, lang)),
                ...arr
            );
        else return handelUnError(val, ...arr);
    }
);
