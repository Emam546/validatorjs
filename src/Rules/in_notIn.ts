import Rule, { MessagesStore, RuleFun } from "@/Rule";
import handelMessage from "@/utils/handelMessage";
import { isString } from "@/utils/types";
export const MessagesIn: MessagesStore<unknown> = {
    en: "The value is not in the array",
};
export const MessagesNotIn: MessagesStore<unknown> = {
    en: "The value is in the array",
};
function contains<Data>(...[value, name]: Parameters<RuleFun<Data>>) {
    if (!isString(value)) return false;
    const values = name
        .split(":")
        .slice(1, name.split(":").length)
        .join(":")
        .split(",");
    return values.includes(value);
}

export const _in = new Rule(/^in:\S+/, (...arr) =>
    contains(...arr) ? undefined : handelMessage(MessagesIn[arr[4]], ...arr)
);
export const notIn = new Rule(/^not_in:\S+/, (...arr) =>
    !contains(...arr) ? undefined : handelMessage(MessagesNotIn[arr[4]], ...arr)
);
