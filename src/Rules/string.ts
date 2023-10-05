import Rule, { MessagesStore } from "@/Rule";
import handelMessage from "@/utils/handelMessage";
import { isString } from "@/utils/types";
export const Messages: MessagesStore<unknown> = {
    en: "THE TYPE OF INPUT IS NOT STRING",
};

export default new Rule<"string", string>("string", (value, ...arr) => {
    return isString(value)
        ? undefined
        : handelMessage(Messages[arr[3]], value, ...arr);
});
