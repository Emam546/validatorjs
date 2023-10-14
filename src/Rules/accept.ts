import Rule, { MessagesStore } from "@/Rule";
import handelMessage from "@/utils/handelMessage";
export const Messages: MessagesStore<unknown> = {
    en: "THE VALUE is not accepted type",
};

export default new Rule<
    "accepted",
    typeof Messages,
    "on" | "true" | "yes" | 1 | true
>(
    "accepted",
    (value, data, path, input, lang, errors) => {
        return value === "on" ||
            value === "true" ||
            value === "yes" ||
            value === 1 ||
            value === "1" ||
            value === true
            ? undefined
            : handelMessage(errors[lang], value, data, path, input, lang);
    },
    Messages
);
