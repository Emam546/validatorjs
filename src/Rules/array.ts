import Rule, { MessagesStore } from "@/Rule";
import handelMessage from "@/utils/handelMessage";
import { isArray } from "@/utils/types";
export const Messages: MessagesStore<unknown> = {
    en: "ARRAY REQUIREMENTS HAVEN'T BEEN APPLIED ",
};
export default new Rule(
    "array",
    (value, data, path, input, lang, errors) => {
        return isArray(value)
            ? undefined
            : handelMessage(errors[lang], value, data, path, input, lang);
    },
    Messages
);
