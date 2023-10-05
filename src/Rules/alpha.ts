import Rule, { MessagesStore } from "@/Rule";
import handelMessage from "@/utils/handelMessage";
import { isString } from "@/utils/types";
export const Messages: MessagesStore<unknown> = {
    en: "The input value is not alphabetic",
};
export default new Rule<"alpha", string>("alpha", (value, ...arr) => {
    return isString(value) && /^[a-zA-Z]+$/.test(value)
        ? undefined
        : handelMessage(Messages[arr[3]], value, ...arr);
});
