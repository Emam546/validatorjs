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
    (...arr) =>
        contains(arr[0], arr[1].in)
            ? undefined
            : handelMessage(MessagesIn[arr[3]], ...arr)
);
export const notIn = new Rule<{ not_in: (string | number)[] }>(
    (val: unknown): val is { not_in: (string | number)[] } => {
        return hasOwnProperty(val, "in") && isArray(val.in);
    },
    (...arr) =>
        !contains(arr[0], arr[1].not_in)
            ? undefined
            : handelMessage(MessagesNotIn[arr[3]], ...arr)
);
