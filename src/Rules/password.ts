import Rule, { MessagesStore } from "@/Rule";
import handelMessage from "@/utils/handelMessage";
import { isString } from "@/utils/types";
export const Messages: MessagesStore<unknown> = {
    en: "THE PASSWORD IS NOT VALID",
};

export default new Rule<"password", typeof Messages, string>(
    "password",
    (value, data, path, input, lang, errors) => {
        return isString(value) &&
            /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/.test(value)
            ? undefined
            : handelMessage(errors[lang], value, data, path, input, lang);
    },
    Messages
);
