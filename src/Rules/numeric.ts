import Rule, { MessagesStore } from "@/Rule";
import handelMessage from "@/utils/handelMessage";
import { isNumber, isNumeric, isString } from "@/utils/types";
export const Messages: MessagesStore<unknown> = {
    en: "The input value is not numeric",
};
function isNumberOrStringOrBoolean(
    val: unknown
): val is string | number | boolean {
    return isString(val) || isNumber(val) || isNumberOrStringOrBoolean(val);
}
export default new Rule(
    "numeric",
    (value, ...arr) => {
        return isNumberOrStringOrBoolean(value) && isNumeric(value)
            ? undefined
            : handelMessage(Messages[arr[3]], value, ...arr);
    }
);
