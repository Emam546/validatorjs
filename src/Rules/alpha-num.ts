import Rule, { MessagesStore } from "@/Rule";
import handelMessage from "@/utils/handelMessage";
import { isString } from "@/utils/types";
const Messages: MessagesStore<unknown> = {
    en: "The input value must contains only characters or numeric values",
};
export default new Rule("alpha_num", (value, ...arr) => {
    return isString(value) && /^[a-zA-Z0-9]+$/.test(value)
        ? undefined
        : handelMessage(Messages[arr[2]], value, ...arr);
});
