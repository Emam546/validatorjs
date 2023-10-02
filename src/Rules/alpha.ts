import Rule, { MessagesStore } from "@/Rule";
import handelMessage from "@/utils/handelMessage";
export const Messages: MessagesStore<unknown> = {
    en: "The input value is not alphabetic",
};
export default new Rule<unknown, string>("alpha", (value, ...arr) => {
    return /^[a-zA-Z]+$/.test(value)
        ? undefined
        : handelMessage(Messages[arr[3]], value, ...arr);
});
