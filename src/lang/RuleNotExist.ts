import Validator from "..";
import { MessagesStore, RuleFun } from "../Rule";
export const message: MessagesStore = {
    en: (value, name, validator) => `THE RULE ${name} IS NOT EXIST`,
};
export default function RuleIsNotExist(...arr: Parameters<RuleFun>): string {
    const [obj, _, validator, ...arr2] = arr;
    const val = message[validator.lang];
    if (val)
        if (typeof val == "string") return val;
        else val(obj, "Not matched error", validator, ...arr2);
    throw new Error("this language is not in not matching messages");
}
