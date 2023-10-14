import Rule, { MessagesStore } from "@/Rule";
import handelMessage from "@/utils/handelMessage";
import { isString } from "@/utils/types";
export const Messages: MessagesStore<unknown> = {
    en: "THE TYPE OF INPUT IS NOT STRING",
};

export default new Rule<"string", typeof Messages, string>(
    "string",
    (value, data, path, input, lang, errors) => {
        return isString(value)
            ? undefined
            : handelMessage(errors[lang], value, data, path, input, lang);
    },
    Messages
);
