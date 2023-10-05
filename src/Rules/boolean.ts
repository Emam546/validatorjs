import Rule, { MessagesStore } from "@/Rule";
import handelMessage from "@/utils/handelMessage";
import { isBool } from "@/utils/types";
export const Messages: MessagesStore<unknown> = {
    en: "The input value is no a boolean",
};
export default new Rule<"boolean",boolean>("boolean", (value, ...arr) => {
    return isBool(value)
        ? undefined
        : handelMessage(Messages[arr[3]], value, ...arr);
});
