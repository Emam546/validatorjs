import Rule, { MessagesStore } from "@/Rule";
import handelMessage from "@/utils/handelMessage";
import { isString } from "@/utils/types";
export const Messages: MessagesStore<unknown> = {
    en: "The input value is not alphabetic",
};
export default new Rule(
    "alpha",
    (value, data, path, input, lang, errors) => {
        return isString(value) && /^[a-zA-Z]+$/.test(value)
            ? undefined
            : handelMessage(errors[lang], value, data, path, input, lang);
    },
    Messages
);
