import Rule, { MessagesStore } from "@/Rule";
import handelMessage from "@/utils/handelMessage";
import { isString } from "@/utils/types";
export const Messages: MessagesStore<unknown> = {
    en: "The input value contains alpha-numeric characters, as well as dashes and underscores.",
};
export default new Rule<"alpha_dash", typeof Messages, string>(
    "alpha_dash",
    (value, data, path, input, lang, errors) => {
        return isString(value) && /^[a-zA-Z0-9_-]+$/.test(value)
            ? undefined
            : handelMessage(errors[lang], value, data, path, input, lang);
    },
    Messages
);
