import Rule, { MessagesStore } from "@/Rule";
import handelMessage from "@/utils/handelMessage";
import { isBool } from "@/utils/types";
export const Messages: MessagesStore<unknown> = {
    en: "The input value is no a boolean",
};
export default new Rule<"boolean", typeof Messages, boolean>(
    "boolean",
    (value, data, path, input, lang, errors) => {
        return isBool(value)
            ? undefined
            : handelMessage(errors[lang], value, data, path, input, lang);
    },
    Messages
);
