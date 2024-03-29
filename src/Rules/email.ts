/* eslint-disable no-useless-escape */
import Rule, { MessagesStore } from "@/Rule";
import handelMessage from "@/utils/handelMessage";
import { isString } from "@/utils/types";
export const Messages: MessagesStore<unknown> = {
    en: "THIS IS NOT A VALID EMAIL",
};
export default new Rule<"email", typeof Messages, string>(
    "email",
    (value, data, path, input, lang, errors) => {
        if (!isString(value))
            return handelMessage(errors[lang], value, data, path, input, lang);

        let re =
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+\.)+[a-zA-Z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]{2,}))$/;
        if (re.test(value)) return undefined;

        re = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return re.test(value)
            ? undefined
            : handelMessage(errors[lang], value, data, path, input, lang);
    },
    Messages
);
