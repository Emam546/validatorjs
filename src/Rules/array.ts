import Rule, { MessagesStore } from "@/Rule";
import handelMessage from "@/utils/handelMessage";
import { isArray } from "@/utils/types";
export const Messages: MessagesStore<unknown> = {
    en: "ARRAY REQUIREMENTS HAVEN'T BEEN APPLIED ",
};
export default new Rule("array", (value, ...arr) => {
    return isArray(value)
        ? undefined
        : handelMessage(Messages[arr[3]], value, ...arr);
});
