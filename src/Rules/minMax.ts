import Rule, { StoredMessage } from "@/Rule";
import LangTypes from "../types/lang";
import handelUnError from "@/utils/handelUnError";
import { isArray, isNumber, isObject, isString } from "@/utils/types";
import UnKnownInputValue from "./Messages/unKnownValue";
import UnKnownRuleValue from "./Messages/UnknownRule";
export { default as UnKnownInputValue } from "./Messages/unKnownValue";
export { default as UnKnownRuleValue } from "./Messages/UnknownRule";
import { hasOwnProperty } from "@/utils/compare";
import handelMessage from "@/utils/handelMessage";
import handelUndefined from "@/utils/handelUndefined";
import { MessagesStore } from "@/Rule";

export const MinError: MessagesStore<unknown> = {
    en: "the input value has not reached the minimum value",
};
export const MaXError: MessagesStore<unknown> = {
    en: "the input value has reached the maximum value",
};
function getNumber<Data>(
    value: unknown,
    lang: LangTypes,
    errors: MessagesStore<unknown>
): number | StoredMessage<Data> | undefined {
    if (isNumber(value)) return value;
    if (isArray(value) || isString(value)) return value.length;
    if (value instanceof Set || value instanceof Map) return value.size;
    if (isObject(value)) return Object.keys(value).length;
    return errors[lang];
}
function minFun(
    value: number,
    min: number,
    lang: LangTypes,
    errors: MessagesStore<{ min: number }>
): string | undefined {
    min = isNaN(min) ? 0 : min;
    if (value < min) return handelUndefined(errors[lang]) as string;
}
function maxFun(
    value: number,
    max: number,
    lang: LangTypes,
    errors: MessagesStore<{ max: number }>
): string | undefined {
    if (isNaN(max)) return handelUndefined(UnKnownRuleValue[lang]) as string;
    if (value > max) return handelUndefined(errors[lang]) as string;
}

export const min = new Rule<
    { min: number },
    {
        unknownError: MessagesStore<unknown>;
        errors: MessagesStore<{ min: number }>;
    }
>(
    (val: unknown): val is { min: number } => {
        return hasOwnProperty(val, "min") && isNumber(val.min);
    },
    function MinHandler(value, data, path, input, lang, errors) {
        const min = data.min;
        const val = getNumber<{ min: number }>(
            value,
            lang,
            errors.unknownError
        );
        if (isNumber(val)) return minFun(val, min, lang, errors.errors);
        else return handelMessage(val, value, data, path, input, lang);
    },
    { unknownError: UnKnownInputValue, errors: MinError }
);
export const max = new Rule<
    { max: number },
    {
        unknownError: MessagesStore<unknown>;
        errors: MessagesStore<{ max: number }>;
    }
>(
    (val: unknown): val is { max: number } => {
        return hasOwnProperty(val, "max") && isNumber(val.max);
    },
    function MaxHandler(value, data, path, input, lang, errors) {
        const min = data.max;
        const val = getNumber<{ max: number }>(
            value,
            lang,
            errors.unknownError
        );
        if (isNumber(val)) return maxFun(val, min, lang, errors.errors);
        else return handelUnError(val, value, data, path, input, lang);
    },
    { unknownError: UnKnownInputValue, errors: MaXError }
);
