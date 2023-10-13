/* eslint-disable no-useless-escape */
import Rule, { MessagesStore } from "@/Rule";
import handelMessage from "@/utils/handelMessage";
import { isString } from "@/utils/types";
export const Messages: MessagesStore<unknown> = { en: "THE URL IS NOT VALID" };

export default new Rule(
    "url",
    (value, data, path, input, lang, errors) => {
        return isString(value) &&
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-z]{2,63}\b([-a-zA-Z0-9@:%_\+.~#?&/=]*)/i.test(
                value
            )
            ? undefined
            : handelMessage(errors[lang], value, data, path, input, lang);
    },
    Messages
);
