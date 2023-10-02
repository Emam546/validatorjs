import Rule, { MessagesStore } from "@/Rule";
import handelMessage from "@/utils/handelMessage";
export const Messages: MessagesStore<unknown> = {
    en: "The input value is no a boolean",
};
export default new Rule(
    "boolean",
    (value: string | number | boolean, ...arr) => {
        return value === true ||
            value === false ||
            value === 0 ||
            value === 1 ||
            value === "0" ||
            value === "1" ||
            value === "true" ||
            value === "false"
            ? undefined
            : handelMessage(Messages[arr[3]], value, ...arr);
    }
);
