import Rule, { MessagesStore } from "@/Rule";
import { hasOwnProperty } from "@/utils/compare";
import handelMessage from "@/utils/handelMessage";
import { isArray } from "@/utils/types";
export const MessagesIn: MessagesStore<unknown> = {
    en: "The value is not in the array",
};
export const MessagesNotIn: MessagesStore<unknown> = {
    en: "The value is in the array",
};
function contains(value: unknown, values: (string | number)[]) {
    return values.includes(value as string | number);
}

export const _in = new Rule<{ in: (string | number)[] }>(
    (val: unknown): val is { in: (string | number)[] } => {
        return hasOwnProperty(val, "in") && isArray(val.in);
    },
    (value, data, path, input, lang, errors) =>
        contains(value, data.in)
            ? undefined
            : handelMessage(errors[lang], value, data, path, input, lang),
    MessagesIn
);
export const notIn = new Rule<{ not_in: (string | number)[] }>(
    (val: unknown): val is { not_in: (string | number)[] } => {
        return hasOwnProperty(val, "not_in") && isArray(val.not_in);
    },
    (value, data, path, input, lang, errors) =>
        !contains(value, data.not_in)
            ? undefined
            : handelMessage(errors[lang], value, data, path, input, lang),
    MessagesNotIn
);
