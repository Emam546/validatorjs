import Rule, { MessagesStore } from "@/Rule";
import handelMessage from "@/utils/handelMessage";
export const Messages: MessagesStore<unknown> = {
    en: "THE VALUE is not accepted type",
};

export default new Rule<"accepted", "on" | "true" | "yes" | 1 | "1" | true>(
    "accepted",
    (value, ...arr) => {
        return value === "on" ||
            value === "true" ||
            value === "yes" ||
            value === 1 ||
            value === "1" ||
            value === true
            ? undefined
            : handelMessage(Messages[arr[3]], value, ...arr);
    }
);
